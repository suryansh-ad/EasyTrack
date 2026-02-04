import "./Doc.css";

function Doc() {
    return (
        <div className="docPage">
            <section className="docHero">
                <div className="docHeroBadge">EasyTrack Guide</div>
                <h1>Plan lessons, track progress, and run your week with clarity.</h1>
                <p>
                    EasyTrack is your teacher workspace for managing classes, building syllabus checklists,
                    and scheduling time slots. This guide shows what each feature does and the fastest way
                    to use it every day.
                </p>
            </section>

            <section className="docGrid">
                <div className="docCard">
                    <h3>Classes</h3>
                    <p>
                        Create classes with grade, subject, and student count. Select a class to see its
                        syllabus and progress at a glance.
                    </p>
                </div>
                <div className="docCard">
                    <h3>Syllabus Topics</h3>
                    <p>
                        Add topics per class, then expand each topic to manage subtopics like a checklist.
                    </p>
                </div>
                <div className="docCard">
                    <h3>Subtopic Checklist</h3>
                    <p>
                        Tick off subtopics as you teach them. Progress updates instantly across the class.
                    </p>
                </div>
                <div className="docCard">
                    <h3>Timetable</h3>
                    <p>
                        Build a weekly schedule, add custom time slots, and assign lessons with colors.
                    </p>
                </div>
                <div className="docCard">
                    <h3>Progress Stats</h3>
                    <p>
                        See total, completed, remaining, and progress percentage for each class.
                    </p>
                </div>
                <div className="docCard">
                    <h3>Theme Toggle</h3>
                    <p>
                        Switch between dark and light modes anytime from the navbar.
                    </p>
                </div>
            </section>

            <section className="docSteps">
                <h2>Best Daily Flow</h2>
                <div className="docStepList">
                    <div className="docStep">
                        <div className="docStepNum">1</div>
                        <div>
                            <h4>Create your classes</h4>
                            <p>Start by adding each class. The first class will auto-select.</p>
                        </div>
                    </div>
                    <div className="docStep">
                        <div className="docStepNum">2</div>
                        <div>
                            <h4>Add syllabus topics</h4>
                            <p>Click Add Topic and enter each chapter or unit.</p>
                        </div>
                    </div>
                    <div className="docStep">
                        <div className="docStepNum">3</div>
                        <div>
                            <h4>Build subtopic checklists</h4>
                            <p>Expand a topic and add subtopics. Tick them off as you teach.</p>
                        </div>
                    </div>
                    <div className="docStep">
                        <div className="docStepNum">4</div>
                        <div>
                            <h4>Plan the week</h4>
                            <p>Open Timetable, add your time slots, and assign lessons.</p>
                        </div>
                    </div>
                    <div className="docStep">
                        <div className="docStepNum">5</div>
                        <div>
                            <h4>Review progress</h4>
                            <p>Use the stats cards to see what’s completed and what’s left.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="docTips">
                <div className="docTipCard">
                    <h3>Quick Tips</h3>
                    <ul>
                        <li>Use colors in Timetable to quickly spot subjects.</li>
                        <li>Keep subtopics short for faster completion tracking.</li>
                        <li>Duplicate prevention is built in for subtopic adds.</li>
                        <li>Custom time slots let you match your school periods.</li>
                    </ul>
                </div>
                <div className="docTipCard">
                    <h3>Common Workflows</h3>
                    <ul>
                        <li>Weekly planning: add slots first, then fill subjects.</li>
                        <li>Daily tracking: check off subtopics after each class.</li>
                        <li>End of week: review progress and adjust next week.</li>
                    </ul>
                </div>
            </section>

            <section className="docCallout">
                <h3>Need a clean start?</h3>
                <p>
                    Create one class, add a single topic, and try 3 subtopics. You’ll see progress update
                    instantly and get a feel for the workflow.
                </p>
            </section>
        </div>
    );
}

export default Doc;
