using System;
using System.Collections;
using System.Collections.Generic;

public abstract class HierarchicalState
{
    // Parent will be null for root state
    public HierarchicalState Parent { get; internal set; }

    private readonly List<HierarchicalState> _subStates = new List<HierarchicalState>();

    protected HierarchicalState(HierarchicalStateMachine machine)
    {
        if (machine == null) throw new ArgumentNullException(nameof(machine));
        StateMachine = machine;
    }

    /// <summary>
    /// Called when entering this state.
    /// </summary>
    protected internal virtual void OnEntry(object parameter) { }

    /// <summary>
    /// Called when exiting this state.
    /// </summary>
    protected internal virtual void OnExit(object parameter) { }

    /// <summary>
    /// Returns the Type of the resulting state for a given transition or null if not handled here.
    /// </summary>
    protected internal abstract Type GetResultingState(object transition, object parameter);

    public void AddSubState(HierarchicalState state)
    {
        if (state == null) throw new ArgumentNullException(nameof(state));
        state.Parent = this;
        _subStates.Add(state);
    }

    internal IReadOnlyList<HierarchicalState> GetSubStates()
    {
        return _subStates.AsReadOnly();
    }

    internal bool HasImmediateSubstate(HierarchicalState s)
    {
        return _subStates.Contains(s);
    }

    internal bool HasSubstate(HierarchicalState s)
    {
        if (HasImmediateSubstate(s)) return true;

        foreach (HierarchicalState ss in _subStates)
        {
            if (ss.HasSubstate(s)) return true;
        }

        return false;
    }

    protected internal HierarchicalStateMachine StateMachine { get; }
}

public class StateChangedEventArgs : EventArgs
{
    public HierarchicalState OldState { get; private set; }
    public HierarchicalState NewState { get; private set; }

    public StateChangedEventArgs(HierarchicalState oldState, HierarchicalState newState)
    {
        if (oldState == null) throw new ArgumentNullException(nameof(oldState));
        if (newState == null) throw new ArgumentNullException(nameof(newState));

        OldState = oldState;
        NewState = newState;
    }
}

public class HierarchicalStateMachine
{
    // will be set during Initialize
    private HierarchicalState _currentState;
    private HierarchicalState _initialState;
    private readonly Dictionary<Type, HierarchicalState> _stateLookup = new Dictionary<Type, HierarchicalState>();

    public event EventHandler<StateChangedEventArgs> StateChanged;

    /// <summary>
    /// Initialize the state machine with the root state (super-state).
    /// This must be called before using ChangeState.
    /// </summary>
    public void Initialize(HierarchicalState rootState)
    {
        if (rootState == null) throw new ArgumentNullException(nameof(rootState));

        _initialState = rootState;
        _currentState = rootState;

        _stateLookup.Clear();
        BuildStateTable(rootState);

        // Invoke initial entry
        _currentState.OnEntry(null);
    }

    private void BuildStateTable(HierarchicalState state)
    {
        if (state == null) return;

        var t = state.GetType();
        if (!_stateLookup.ContainsKey(t))
            _stateLookup[t] = state;

        foreach (var sub in state.GetSubStates())
            BuildStateTable(sub);
    }

    private HierarchicalState ResolveState(Type t)
    {
        if (t == null) throw new ArgumentNullException(nameof(t));

        HierarchicalState found;
        if (!_stateLookup.TryGetValue(t, out found))
            throw new InvalidOperationException($"HsmsInternalState type '{t.Name}' not found in state hierarchy.");
        return found;
    }

    /// <summary>
    /// Change state using a transition identifier (object) and optional parameter.
    /// </summary>
    public void ChangeState(object transition, object parameter)
    {
        if (_currentState == null)
            throw new InvalidOperationException("HsmsInternalState machine not initialized. Call Initialize(...) first.");

        Type resultingType = _currentState.GetResultingState(transition, parameter);

        // climb up until a state handles the transition
        HierarchicalState cursor = _currentState;
        while (resultingType == null)
        {
            cursor = cursor.Parent;
            if (cursor != null)
            {
                resultingType = cursor.GetResultingState(transition, parameter);
            }
            else
            {
                throw new InvalidOperationException(string.Format(
                    "Invalid transition '{0}' from state '{1}'.",
                    transition, _currentState.GetType().Name));
            }
        }

        HierarchicalState fromState = _currentState;
        HierarchicalState toState = ResolveState(resultingType);

        ApplyStateTransition(fromState, toState, parameter);
    }

    private void ApplyStateTransition(HierarchicalState from, HierarchicalState to, object parameter)
    {
        if (from == null) throw new ArgumentNullException(nameof(from));
        if (to == null) throw new ArgumentNullException(nameof(to));

        HierarchicalState common = FindCommonAncestor(from, to);

        ExitUpTo(from, common, parameter);
        EnterDownTo(common, to, parameter);

        _currentState = to;

        var handler = StateChanged;
        if (handler != null)
            handler(this, new StateChangedEventArgs(from, to));
    }

    private static HierarchicalState FindCommonAncestor(HierarchicalState a, HierarchicalState b)
    {
        // collect ancestors of 'a'
        var ancestors = new HashSet<HierarchicalState>();
        HierarchicalState cursor = a;
        while (cursor != null)
        {
            ancestors.Add(cursor);
            cursor = cursor.Parent;
        }

        // walk up 'b' until find common
        cursor = b;
        while (cursor != null)
        {
            if (ancestors.Contains(cursor))
                return cursor;
            cursor = cursor.Parent;
        }

        throw new InvalidOperationException("No common ancestor found between the two states.");
    }

    private static void ExitUpTo(HierarchicalState from, HierarchicalState until, object parameter)
    {
        while (from != until)
        {
            from.OnExit(parameter);
            from = from.Parent ?? throw new InvalidOperationException("Parent expected but was null during exit traversal.");
        }
    }

    private static void EnterDownTo(HierarchicalState from, HierarchicalState to, object parameter)
    {
        // build stack of states from 'to' up to (but excluding) 'from'
        var stack = new Stack<HierarchicalState>();
        HierarchicalState cursor = to;
        while (cursor != from)
        {
            stack.Push(cursor);
            cursor = cursor.Parent ?? throw new InvalidOperationException("Parent expected but was null during entry traversal.");
        }

        while (stack.Count > 0)
        {
            var s = stack.Pop();
            s.OnEntry(parameter);
        }
    }

    public HierarchicalState CurrentState
    {
        get
        {
            if (_currentState == null)
                throw new InvalidOperationException("HsmsInternalState machine not initialized.");
            return _currentState;
        }
    }
}
