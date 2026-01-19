import React from 'react';
import bulbIcon from "../../../../assets/GuideFinalyearproject/bulb.png";
import calendarIcon from "../../../../assets/GuideFinalyearproject/calendar.png";

const ProjectGuidance = ({
  formData,
  flexibleNotes,
  dateInputRef,
  handleInputChange,
  handleFlexibleNotesChange,
  handleCalendarClick,
  handleSubmit,
  handlePreview
}) => {
  return (
    <form> 
      <div className="w-full h-fit flex flex-col gap-7 p-9 opacity-100 border border-[#C0BFD5] rounded-br-lg rounded-bl-lg rounded-tr-lg">
        <div className="w-full h-fit flex flex-col gap-2">
            <span className="w-full h-8 font-poppins font-semibold text-sm leading-8 text-[#343079]">
                Step 1 - Define Project Type
            </span>
            <div className="flex flex-col mx-12 gap-4">
                <label className="flex items-center gap-1 font-poppins font-normal text-sm text-[#343079]">
                    <input
                        type="radio"
                        name="projectType"
                        value="Mini"
                        checked={formData.projectType === 'Mini'}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#343079]"
                    />
                    Mini
                </label>
                <label className="flex items-center gap-1 font-poppins font-normal text-sm text-[#343079]">
                    <input
                        type="radio"
                        name="projectType"
                        value="Major"
                        checked={formData.projectType === 'Major'}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#343079]"
                    />
                    Major
                </label>
            </div>
        </div>
        
        {/* Step 2: Choose Project Domain */}
        <div className="w-full h-fit flex flex-col gap-2">
            <span className="w-full h-8 font-poppins font-semibold text-sm leading-8 text-[#343079]">
                Step 2 - Choose Project Domain
            </span>
            <select
                name="projectDomain"
                value={formData.projectDomain}
                onChange={handleInputChange}
                className="w-[250px] h-10 px-4 py-2 mx-12 border border-[#83828F] text-[#343079] rounded-lg text-sm"
            >
                <option value="">Select a domain</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Data Science & Analytics">Data Science & Analytics</option>
                <option value="Web & Mobile Development">Web & Mobile Development</option>
                <option value="IoT & Robotics">IoT & Robotics</option>
                <option value="Cybersecurity">Cybersecurity</option>
            </select>
        </div>
        
        {/* Step 3: Set Group Size */}
        <div className="w-full h-fit flex flex-col gap-2">
            <span className="w-full h-8 font-poppins font-semibold text-sm leading-8 text-[#343079]">
                Step 3 - Set Group Size
            </span>
            <div className="flex flex-col mx-12 gap-4">
                <label className="flex items-center gap-1 font-poppins font-normal text-sm text-[#343079]">
                    <input
                        type="radio"
                        name="groupSize"
                        value="1 Student"
                        checked={formData.groupSize === '1 Student'}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#343079]"
                    />
                    1 Student
                </label>
                <label className="flex items-center gap-1 font-poppins font-normal text-sm text-[#343079]">
                    <input
                        type="radio"
                        name="groupSize"
                        value="1–2 Students"
                        checked={formData.groupSize === '1–2 Students'}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#343079]"
                    />
                    1–2 Students
                </label>
                <label className="flex items-center gap-1 font-poppins font-normal text-sm text-[#343079]">
                    <input
                        type="radio"
                        name="groupSize"
                        value="3–4 Students"
                        checked={formData.groupSize === '3–4 Students'}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#343079]"
                    />
                    3–4 Students
                </label>
                <label className="flex items-center gap-1 font-poppins font-normal text-sm text-[#343079]">
                    <input
                        type="radio"
                        name="groupSize"
                        value="Flexible"
                        checked={formData.groupSize === 'Flexible'}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#343079]"
                    />
                    Flexible
                </label>
            </div>
            {formData.groupSize === 'Flexible' && (
                <div className="w-full h-fit mx-12 mt-4">
                    <textarea
                        name="flexibleNotes"
                        value={flexibleNotes}
                        onChange={handleFlexibleNotesChange}
                        placeholder="Type your response here."
                        className="w-[1100px] p-4 border border-[#DAD8EE] text-[#343079] rounded-lg text-sm"
                        rows="4"
                    ></textarea>
                </div>
            )}
        </div>
        
        {/* Step 4: Add Schedule (Optional) */}
        <div className="w-full h-fit flex flex-col gap-2">
            <span className="w-full h-8 font-poppins font-semibold text-sm leading-8 text-[#343079]">
                Step 4 - Add Schedule (Optional)
            </span>
            <div className="flex items-center mx-12 gap-2 w-fit">
                <div className="relative w-[175px] h-10">
                    <input
                        ref={dateInputRef}
                        type="date"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleInputChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div
                        className="w-full h-10 px-4 py-2 border border-[#83828F] rounded-lg text-sm flex items-center bg-white cursor-pointer"
                        onClick={handleCalendarClick}
                    >
                        {formData.schedule ? (
                            <span className="text-[#343079]">{new Date(formData.schedule).toLocaleDateString()}</span>
                        ) : (
                            <span className="text-[#83828F]">dd/mm/yyyy</span>
                        )}
                    </div>
                </div>
                <img
                    src={calendarIcon}
                    alt="Calendar"
                    className="w-6 h-6 cursor-pointer"
                    onClick={handleCalendarClick}
                />
            </div>
        </div>
        
        {/* Step 5: Add Notes (Optional) */}
        <div className="w-full h-fit flex flex-col gap-2">
            <span className="w-full h-8 font-poppins font-semibold text-sm leading-8 text-[#343079]">
                Step 5 - Add Notes (Optional)
            </span>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any prerequisites (e.g., students should know Python basics or have a draft proposal ready)."
                className="w-[1100px] h-24 p-4 border border-[#DAD8EE] text-[#343079] mx-12 rounded-lg text-sm"
            />
        </div>
        
        {/* Info Box */}
        <div className="w-full h-fit flex items-center gap-4 p-4 rounded-lg bg-[#E8FFDD]">
            <img src={bulbIcon} alt="Bulb" className="w-[36px] h-[36px]" />
            <span className="w-full h-fit font-poppins font-normal text-base leading-8 text-[#343079]">
                Publishing this guidance earns you +30 Mentorship Points and a ‘Project Mentor’ badge. Keep mentoring to boost your profile visibility.
            </span>
        </div>
        <div className="w-full flex justify-end items-center gap-4 mt-8">
            <button
                type="button"
                onClick={handlePreview}
                className="w-fit self-end px-6 py-2 border border-[#343079] text-[#343079] font-semibold rounded-lg"
            >
                Preview
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                className="w-fit self-end px-6 py-2 bg-[#343079] text-white font-semibold rounded-lg hover:bg-[#282562] transition-colors duration-300"
            >
                Confirm and Publish
            </button>
        </div>
      </div>
    </form>
  );
};

export default ProjectGuidance;