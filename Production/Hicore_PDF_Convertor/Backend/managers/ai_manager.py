import logging
from core.data_manager import DataManager
from modules.ai.ai import AIFactory


class AIManager:
    """Manager for AI operations (summarization, chat, classification)"""
    
    def __init__(self, data_manager: DataManager):
        self.data_manager = data_manager
        # Extend session timeout for AI operations (30 minutes)
        self.data_manager.expiry_time = 1800
    
    def start_action(self, action_type: str, input_file, settings: dict = None):
        """
        Execute AI actions
        
        Args:
            action_type: Type of AI action:
                - "summarize": PDF summarization
                - "chat_with_pdf": Q&A with PDF
                - "smart_classification": Classify and split PDF by document types
                - "smart_merge": AI-powered optimal PDF merging
            input_file: Single PDF path or list of PDF paths
            settings: Optional settings dict:
                For summarize:
                    - summary_type: "short" or "detailed" (default: "short")
                For chat_with_pdf:
                    - mode: "setup" or "query"
                    - question: User question (for query mode)
                For smart_classification:
                    - (no additional settings required)
                For smart_merge:
                    - mode: "analyze" or "merge"
                    - order: List of indices for merge order (for merge mode)
        
        Returns:
            dict with operation results or None on failure
        """
        try:
            logging.info(f"🤖 Starting AI action: {action_type} with settings: {settings}")
            
            # Validate action type
            valid_actions = ["summarize", "chat_with_pdf", "smart_classification", "smart_merge", "translate"]
            if action_type not in valid_actions:
                raise ValueError(f"❌ Unsupported AI action: {action_type}. Valid: {valid_actions}")
            
            # Extract settings
            settings = settings or {}
            
            # Handle input files
            if isinstance(input_file, list):
                # Multiple PDFs
                for file in input_file:
                    self.data_manager.add_input_file(file)
                input_files = self.data_manager.get_input_files()
            else:
                # Single PDF
                self.data_manager.add_input_file(input_file)
                input_files = self.data_manager.get_input_files()[0]
            
            # Set output file based on action type
            if action_type == "chat_with_pdf":
                # Chat uses .pkl session file
                self.data_manager.auto_set_output_file("chat_session")
            elif action_type == "smart_classification":
                # Classification creates multiple PDFs
                self.data_manager.auto_set_output_file("classified")
            elif action_type == "smart_merge":
                # Smart merge creates merged PDF
                self.data_manager.auto_set_output_file("smart_merged")
            elif action_type == "translate":
                # Translation creates translated PDF
                self.data_manager.auto_set_output_file("translated")
            else:
                # Summarize uses .pdf
                self.data_manager.auto_set_output_file("summarize")
            
            output_file = self.data_manager.get_output_file()
            
            # Get appropriate AI operation
            ai_operation = AIFactory.GetAIOperation(action_type)
            
            # Execute operation with settings
            logging.info(f"🎯 Executing {action_type}...")
            result = ai_operation.Process(input_files, output_file, **settings)
            
            # Add output path and session_id to result
            result["output_file"] = output_file
            result["session_id"] = self.data_manager.session_id
            
            logging.info(f"✅ AI {action_type} completed successfully")
            return result
            
        except Exception as e:
            logging.error(f"❌ AI action failed: {e}", exc_info=True)
            return None
