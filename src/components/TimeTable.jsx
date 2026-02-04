import "./TimeTable.css";
import { useEffect, useState } from "react";
import { account } from "../appwrite";
import { addTimeTableEntry, deleteTimeTableEntry, listTimeTableEntries, updateTimeTableEntry } from "./TeacherService";

function TimeTable(){
        const [entries, setEntries] = useState([]);
        const [loading, setLoading] = useState(true);
        const [modalOpen, setModalOpen] = useState(false);
        const [slotModalOpen, setSlotModalOpen] = useState(false);
        const [activeSlot, setActiveSlot] = useState(null);
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [color, setColor] = useState("#22c55e");
        const [slotStart, setSlotStart] = useState("09:00");
        const [slotEnd, setSlotEnd] = useState("10:00");
        const [slotError, setSlotError] = useState("");
        const [refresh, setRefresh] = useState(false);

        const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const defaultSlots = [
            { start: "09:00", end: "10:00" },
            { start: "10:00", end: "11:00" },
            { start: "11:00", end: "12:00" },
            { start: "12:00", end: "13:00" },
            { start: "13:00", end: "14:00" }
        ];
        const [timeSlots, setTimeSlots] = useState(defaultSlots);

        useEffect(() => {
            async function fetchEntries(){
                try{
                    const user = await account.get();
                    const res = await listTimeTableEntries(user.$id);
                    setEntries(res.documents);
                }catch(error){
                    console.error("Could not load timetable", error);
                }finally{
                    setLoading(false);
                }
            }
            fetchEntries();
        }, [refresh]);

        useEffect(() => {
            try{
                const saved = localStorage.getItem("timetableSlots");
                if (saved){
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0){
                        setTimeSlots(parsed);
                    }
                }
            }catch(error){
                console.warn("Could not load slots from storage", error);
            }
        }, []);

        useEffect(() => {
            try{
                localStorage.setItem("timetableSlots", JSON.stringify(timeSlots));
            }catch(error){
                console.warn("Could not save slots to storage", error);
            }
        }, [timeSlots]);

        function openCreate(day, slot){
            setActiveSlot({ day, startTime: slot.start, endTime: slot.end, mode: "create" });
            setTitle("");
            setDescription("");
            setColor("#22c55e");
            setModalOpen(true);
        }

        function openEdit(entry){
            setActiveSlot({ ...entry, mode: "edit" });
            setTitle(entry.title || "");
            setDescription(entry.description || "");
            setColor(entry.color || "#22c55e");
            setModalOpen(true);
        }

        async function handleSave(){
            try{
                const user = await account.get();
                if (!title.trim()) return;
                if (activeSlot.mode === "create") {
                    await addTimeTableEntry(user.$id, {
                        day: activeSlot.day,
                        startTime: activeSlot.startTime,
                        endTime: activeSlot.endTime,
                        title: title.trim(),
                        description: description.trim(),
                        color
                    });
                } else {
                    await updateTimeTableEntry(activeSlot.$id, {
                        title: title.trim(),
                        description: description.trim(),
                        color
                    });
                }
                setModalOpen(false);
                setRefresh(prev => !prev);
            }catch(error){
                console.error("Could not save entry", error);
            }
        }

        async function handleDelete(entryId){
            try{
                await deleteTimeTableEntry(entryId);
                setRefresh(prev => !prev);
            }catch(error){
                console.error("Could not delete entry", error);
            }
        }

        const getEntry = (day, slot) =>
            entries.find(e => e.day === day && e.startTime === slot.start && e.endTime === slot.end);

        function openAddSlot(){
            setSlotStart("09:00");
            setSlotEnd("10:00");
            setSlotError("");
            setSlotModalOpen(true);
        }

        function toMinutes(value){
            const [h, m] = value.split(":").map(Number);
            return (h * 60) + m;
        }

        function handleAddSlot(){
            if (!slotStart || !slotEnd){
                setSlotError("Start and end time are required.");
                return;
            }
            if (toMinutes(slotEnd) <= toMinutes(slotStart)){
                setSlotError("End time must be after start time.");
                return;
            }
            const exists = timeSlots.some(s => s.start === slotStart && s.end === slotEnd);
            if (exists){
                setSlotError("That time slot already exists.");
                return;
            }
            const next = [...timeSlots, { start: slotStart, end: slotEnd }]
                .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
            setTimeSlots(next);
            setSlotModalOpen(false);
        }

        async function handleRemoveSlot(slot){
            const ok = window.confirm(`Remove time slot ${slot.start} - ${slot.end}? This will delete any classes in that slot.`);
            if (!ok) return;
            try{
                const toDelete = entries.filter(
                    e => e.startTime === slot.start && e.endTime === slot.end
                );
                for (const entry of toDelete){
                    await deleteTimeTableEntry(entry.$id);
                }
                setEntries(prev => prev.filter(e => !(e.startTime === slot.start && e.endTime === slot.end)));
                setTimeSlots(prev => prev.filter(s => !(s.start === slot.start && s.end === slot.end)));
            }catch(error){
                console.error("Could not remove slot", error);
            }
        }

    return(
        <>
            <div className="timetablePage">
                <div className="timetableHeader">
                    <h2>Weekly Schedule</h2>
                    <span className="timetableHint">{loading ? "Loading..." : "Click a cell to add a subject"}</span>
                    <button className="addSlotBtn" onClick={openAddSlot}>Add Time Slot</button>
                </div>
                <div className="timetableGrid">
                    <div className="timetableCell header">Time</div>
                    {days.map(day => (
                        <div key={day} className="timetableCell header">{day}</div>
                    ))}

                    {timeSlots.map((slot) => (
                        <div key={`${slot.start}-${slot.end}`} className="timetableRow">
                            <div className="timetableCell timeCell">
                                <span>{slot.start} - {slot.end}</span>
                                <button className="slotRemoveBtn" onClick={() => handleRemoveSlot(slot)} aria-label="Remove time slot">
                                    ×
                                </button>
                            </div>
                            {days.map(day => {
                                const entry = getEntry(day, slot);
                                return (
                                    <div key={`${day}-${slot.start}`} className="timetableCell">
                                        {entry ? (
                                            <div className="entryCard" style={{ borderColor: entry.color, backgroundColor: `${entry.color}20` }}>
                                                <div className="entryTitle">{entry.title}</div>
                                                <div className="entryDesc">{entry.description}</div>
                                                <div className="entryActions">
                                                    <button onClick={() => openEdit(entry)} className="entryBtn">Edit</button>
                                                    <button onClick={() => handleDelete(entry.$id)} className="entryBtn danger">Delete</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button className="emptyCell" onClick={() => openCreate(day, slot)}>
                                                Click to add
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (
                <div className="timetableModalBg" onClick={() => setModalOpen(false)}>
                    <div className="timetableModal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h3>{activeSlot?.mode === "edit" ? "Edit Time Slot" : "Add Time Slot"}</h3>
                            <button className="modalClose" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
                        </div>
                        <div className="modalRow">
                            <label>Subject *</label>
                            <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Mathematics" required />
                        </div>
                        <div className="modalRow">
                            <label>Description / Class</label>
                            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Algebra and Geometry / FS-605" />
                        </div>
                        <div className="modalRow">
                            <label>Day *</label>
                            <div className="dayPills">
                                {days.map(d => {
                                    const isActive = activeSlot?.day === d;
                                    return (
                                        <button
                                            key={d}
                                            type="button"
                                            className={`dayPill ${isActive ? "active" : ""}`}
                                            onClick={() => setActiveSlot(prev => ({ ...prev, day: d }))}
                                        >
                                            {d.slice(0,3)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modalRow">
                            <div className="timeRow">
                                <div className="timeCol">
                                    <label>Start Time *</label>
                                    <input
                                        type="time"
                                        value={activeSlot?.startTime || "09:00"}
                                        onChange={(e) => setActiveSlot(prev => ({ ...prev, startTime: e.target.value }))}
                                    />
                                </div>
                                <div className="timeCol">
                                    <label>End Time *</label>
                                    <input
                                        type="time"
                                        value={activeSlot?.endTime || "10:00"}
                                        onChange={(e) => setActiveSlot(prev => ({ ...prev, endTime: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modalRow">
                            <label>Color</label>
                            <div className="colorDots">
                                {[
                                    "#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6",
                                    "#ec4899","#f43f5e","#84cc16","#10b981","#6366f1","#a855f7","#d946ef",
                                    "#f59e0b","#059669","#0ea5e9","#7c3aed"
                                ].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`colorDot ${color === c ? "active" : ""}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                        aria-label={`Select ${c}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="modalActions">
                            <button onClick={() => setModalOpen(false)} className="ghost">Cancel</button>
                            <button onClick={handleSave} className="primary">
                                {activeSlot?.mode === "edit" ? "Update Slot" : "Save Slot"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {slotModalOpen && (
                <div className="timetableModalBg" onClick={() => setSlotModalOpen(false)}>
                    <div className="timetableModal slotModal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h3>Add Time Slot</h3>
                            <button className="modalClose" onClick={() => setSlotModalOpen(false)} aria-label="Close">×</button>
                        </div>
                        <div className="modalRow">
                            <div className="timeRow">
                                <div className="timeCol">
                                    <label>Start Time *</label>
                                    <input
                                        type="time"
                                        value={slotStart}
                                        onChange={(e) => setSlotStart(e.target.value)}
                                    />
                                </div>
                                <div className="timeCol">
                                    <label>End Time *</label>
                                    <input
                                        type="time"
                                        value={slotEnd}
                                        onChange={(e) => setSlotEnd(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {slotError && <div className="slotError">{slotError}</div>}
                        <div className="modalActions">
                            <button onClick={() => setSlotModalOpen(false)} className="ghost">Cancel</button>
                            <button onClick={handleAddSlot} className="primary">Add Slot</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default TimeTable;
