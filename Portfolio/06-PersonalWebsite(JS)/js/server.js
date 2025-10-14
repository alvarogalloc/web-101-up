console.log("Running the script");


let activities = [
  { day: "Monday", start: "07:00", end: "08:30", desc: "Running", place: "Metro Park", type: "Personal", notes: "Morning run", status: "free" },
  { day: "Monday", start: "11:00", end: "12:00", desc: "Gym", place: "Gym", type: "Personal", notes: "Workout", status: "free" },
  { day: "Monday", start: "13:00", end: "15:00", desc: "Class", place: "UP", type: "School", notes: "Algorithms", status: "busy" },
  { day: "Monday", start: "16:00", end: "17:30", desc: "Class", place: "UP", type: "School", notes: "Math", status: "busy" },
  { day: "Tuesday", start: "07:00", end: "14:30", desc: "Class", place: "UP", type: "School", notes: "Econ, Web, Lin. Algebra, Ethics", status: "busy" },
  { day: "Tuesday", start: "15:00", end: "17:00", desc: "Class", place: "UP", type: "School", notes: "Competitive Programming", status: "free" },
  { day: "Wednesday", start: "07:00", end: "08:30", desc: "Running", place: "Metro Park", type: "Personal", notes: "Morning run", status: "free" },
  { day: "Wednesday", start: "11:00", end: "12:00", desc: "Gym", place: "Gym", type: "Personal", notes: "Workout", status: "free" },
  { day: "Wednesday", start: "13:00", end: "15:00", desc: "Class", place: "UP", type: "School", notes: "Algorithms", status: "busy" },
  { day: "Wednesday", start: "16:00", end: "17:30", desc: "Class", place: "UP", type: "School", notes: "Math", status: "busy" },
  { day: "Wednesday", start: "19:00", end: "21:00", desc: "Class", place: "UP", type: "School", notes: "Project Management", status: "busy" },
  { day: "Thursday", start: "07:00", end: "14:30", desc: "Class", place: "UP", type: "School", notes: "Econ, Web, Lin. Algebra, Ethics", status: "busy" },
  { day: "Thursday", start: "19:00", end: "20:30", desc: "Círculo", place: "AltoValle", type: "Other", notes: "Evening", status: "free" },
];

const tbody = document.querySelector("#scheduleTable tbody");
function appendChild(item) {
  const tr = document.createElement("tr");

  const statusColor = item.status === "free" ? "lightgreen" : "yellow";
  const icon = item.status === "free" ? "free.png" : "busy.png";

  tr.innerHTML = `
      <td>${item.day}</td>
      <td>${item.start}</td>
      <td>${item.end}</td>
      <td>${item.desc}</td>
      <td>${item.place}</td>
      <td>${item.type}</td>
      <td>${item.notes}</td>
      <td bgcolor="${statusColor}">
        <img src="images/${icon}" alt="${item.status}" width="24" />
      </td>
    `;

  tbody.appendChild(tr);

}

activities.forEach(item => {
  appendChild(item);
});


document.querySelector('#eventForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;

  const newActivity = {
    day: form.date.value,          // or another input for "day"
    start: form.start.value,
    end: form.end.value,
    desc: form.notes.value,
    place: form.place.value,
    type: form.type.value,
    notes: form.notes.value,
    status: form.busy.value,     // e.g. "free" or "busy"
  };
  activities.push(newActivity);
  appendChild(newActivity);

  form.reset();
});
