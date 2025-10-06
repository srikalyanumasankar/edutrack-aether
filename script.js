// ---------- Storage Functions ----------
function loadStudents() {
  let data = localStorage.getItem("students");
  return data ? JSON.parse(data) : [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// ---------- Add Student ----------
function addStudent() {
  let name = document.getElementById("name").value.trim();
  let subjects = document.getElementById("subjects").value.trim().split(",");
  let marks = document.getElementById("marks").value.trim().split(",").map(Number);

  if (!name || subjects.length !== marks.length) {
    alert("Subjects and marks count must match!");
    return;
  }

  let students = loadStudents();
  students.push({ name, subjects, marks });
  saveStudents(students);

  document.getElementById("name").value = "";
  document.getElementById("subjects").value = "";
  document.getElementById("marks").value = "";
  showStudents();
  glowEffect("Student added successfully!");
}

// ---------- Show Students Table ----------
function showStudents() {
  let students = loadStudents();
  students.sort((a, b) => {
    let totalA = a.marks.reduce((x, y) => x + y, 0);
    let totalB = b.marks.reduce((x, y) => x + y, 0);
    return totalB - totalA; // descending
  });

  let table = document.getElementById("studentTable");
  table.innerHTML = "<tr><th>Student Name (click for report card)</th></tr>";

  students.forEach((s, index) => {
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    cell.innerText = s.name;
    cell.style.cursor = "pointer";
    cell.onclick = () => showReportCard(index);
    row.appendChild(cell);
    table.appendChild(row);
  });
}

// ---------- Report Card ----------
function showReportCard(index) {
  let students = loadStudents();
  let student = students[index];

  let container = document.getElementById("reportCard");
  container.innerHTML = "";

  let total = student.marks.reduce((x, y) => x + y, 0);
  let avg = (total / student.marks.length).toFixed(2);

let html = `<h2>Report Card: ${student.name}</h2>`;
html += "<table><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>";
student.subjects.forEach((sub, i) => {
  let grade = getGrade(student.marks[i]);
  html += `<tr><td>${sub}</td><td>${student.marks[i]}</td><td>${grade}</td></tr>`;
});
html += `</table><p><b>Total Marks:</b> ${total}</p>`;
html += `<p><b>Average Marks:</b> ${avg}</p>`;
html += `<p><b>Overall Grade:</b> ${getGrade(avg)}</p>`;
html += `<button onclick="backToMain()">⬅ Back to Main Page</button>`;


  container.innerHTML = html;

  // Show report page, hide main page
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("reportPage").style.display = "flex";
}

// ---------- Back Button ----------
function backToMain() {
  document.getElementById("mainPage").style.display = "flex";
  document.getElementById("reportPage").style.display = "none";
}

// ---------- Clear All Students ----------
function clearData() {
  if (confirm("Clear all student data?")) {
    localStorage.removeItem("students");
    showStudents();
    glowEffect("All data cleared!");
  }
}

// ---------- Subject Analysis ----------
function analyzeSubject() {
  let subject = document.getElementById("subjectQuery").value.trim();
  let students = loadStudents();

  let total = 0, count = 0;
  let high = -1, low = 101;

  for (let s of students) {
    let idx = s.subjects.indexOf(subject);
    if (idx !== -1) {
      let mark = s.marks[idx];
      total += mark;
      count++;
      if (mark > high) high = mark;
      if (mark < low) low = mark;
    }
  }

  let resultDiv = document.getElementById("result");
  if (count > 0) {
    let avg = (total / count).toFixed(2);
    resultDiv.innerHTML = `
      <h3>${subject} Analysis</h3>
      <p><b>Average:</b> ${avg}</p>
      <p><b>Highest:</b> ${high}</p>
      <p><b>Lowest:</b> ${low}</p>
    `;
  } else {
    resultDiv.innerHTML = `<p>No data found for ${subject}.</p>`;
  }
}

// ---------- Class Analytics ----------
function showClassAnalytics() {
  let students = loadStudents();
  if (students.length === 0) {
    document.getElementById("classAnalytics").innerHTML = "<p>No students in database.</p>";
    return;
  }

  let allSubjects = new Set();
  students.forEach(s => s.subjects.forEach(sub => allSubjects.add(sub)));
  allSubjects = Array.from(allSubjects);

  let html = "<h3>Subject-wise Summary</h3><table><tr><th>Subject</th><th>Average</th><th>Highest</th><th>Lowest</th></tr>";

  let totalAllMarks = 0;
  let countAllMarks = 0;

  allSubjects.forEach(sub => {
    let total = 0, count = 0, high = -1, low = 101;
    students.forEach(s => {
      let idx = s.subjects.indexOf(sub);
      if (idx !== -1) {
        let mark = s.marks[idx];
        total += mark;
        count++;
        totalAllMarks += mark;
        countAllMarks++;
        if (mark > high) high = mark;
        if (mark < low) low = mark;
      }
    });
    let avg = (total / count).toFixed(2);
    html += `<tr><td>${sub}</td><td>${avg}</td><td>${high}</td><td>${low}</td></tr>`;
  });

  html += "</table>";

  // Overall class average
  let classAvg = (totalAllMarks / countAllMarks).toFixed(2);
  html += `<p><b>Overall Class Average:</b> ${classAvg}</p>`;

  // Overall top scorer(s)
  let topScore = Math.max(...students.map(s => s.marks.reduce((x, y) => x + y, 0)));
  let topScorers = students.filter(s => s.marks.reduce((x, y) => x + y, 0) === topScore)
                           .map(s => s.name).join(", ");
  html += `<p><b>Top Scorer(s):</b> ${topScorers} (${topScore} marks)</p>`;
  html += `<p><b>Total Students:</b> ${students.length}</p>`;

  document.getElementById("classAnalytics").innerHTML = html;
}

// ---------- Glow Popup ----------
function glowEffect(msg) {
  let overlay = document.createElement("div");
  overlay.className = "popup";
  overlay.innerText = msg;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1500);
}

// ---------- Initialize ----------
showStudents();
function getGrade(mark) {
  if (mark >= 90) return "A+";
  else if (mark >= 80) return "A";
  else if (mark >= 70) return "B+";
  else if (mark >= 60) return "B";
  else if (mark >= 50) return "C";
  else if (mark >= 40) return "D";
  else return "F";
}
function showPythonCode() {
    let codeContainer = document.getElementById("pythonCode");

    if (codeContainer.style.display === "none") {
        codeContainer.style.display = "block";

        // Paste your full Python program here as a string
        codeContainer.textContent = `
# EduTrack Aether - Python Version

students = []

def add_student():
    name = input("Enter student name: ")
    subjects = input("Enter subjects separated by commas: ").split(",")
    marks = []
    for sub in subjects:
        m = float(input(f"Enter marks for {sub.strip()}: "))
        marks.append(m)
    students.append({"name": name, "subjects": [s.strip() for s in subjects], "marks": marks})

def show_students():
    for i, s in enumerate(students):
        print(f"{i+1}. {s['name']} - Total: {sum(s['marks'])}")

# Example usage:
# add_student()
# show_students()
        `;
    } else {
        codeContainer.style.display = "none";
    }
}
