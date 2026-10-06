"""
SkillMatch - Python SQLite Database Layer
Compatible with both Streamlit (app.py) and Node.js Express backend (server.ts)
"""

import sqlite3
import json
import os
import sys
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skillmatch.db")

def get_connection():
    """Returns a sqlite3 connection with row_factory set to Row."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and seeds default demo data if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    # Students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        college TEXT,
        branch TEXT,
        cgpa REAL,
        graduation_year INTEGER,
        bio TEXT,
        skills TEXT,       -- JSON array of strings
        stats TEXT        -- JSON object
    );
    """)

    # Companies table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        industry TEXT,
        headquarters TEXT,
        website TEXT,
        contact_email TEXT,
        description TEXT,
        stats TEXT        -- JSON object
    );
    """)

    # Jobs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company_id TEXT,
        company TEXT NOT NULL,
        department TEXT,
        location TEXT,
        type TEXT,
        experience TEXT,
        salary TEXT,
        skills TEXT,       -- JSON array of strings
        posted_date TEXT,
        applicants_count INTEGER DEFAULT 0,
        match_score INTEGER DEFAULT 80,
        description TEXT,
        status TEXT DEFAULT 'Open'
    );
    """)

    # Applications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        job_title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        applied_on TEXT,
        match_score INTEGER,
        status TEXT DEFAULT 'Applied',
        student_id TEXT,
        student_name TEXT
    );
    """)

    # Applicants table (for companies reviewing candidates)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applicants (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        college TEXT,
        branch TEXT,
        cgpa REAL,
        match_score INTEGER,
        applied_on TEXT,
        status TEXT DEFAULT 'Applied',
        skills TEXT,       -- JSON array
        experience_level TEXT,
        top_skill TEXT
    );
    """)

    conn.commit()

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM jobs;")
    jobs_count = cursor.fetchone()[0]

    if jobs_count == 0:
        seed_data(conn)

    conn.close()
    return {"status": "ok", "db_file": DB_FILE, "message": "Database initialized successfully"}

def seed_data(conn):
    """Seeds rich initial dataset for college recruitment platform."""
    cursor = conn.cursor()

    # Seed Student
    student = {
        "id": "student_01",
        "name": "Rahul Patil",
        "email": "rahul.patil@engg.pune.edu",
        "college": "Pune Institute of Computer Technology (PICT)",
        "branch": "Computer Engineering",
        "cgpa": 8.74,
        "graduation_year": 2027,
        "bio": "Third-year engineering student passionate about full-stack development, distributed databases, and machine learning pipelines.",
        "skills": json.dumps(["Python", "React", "TypeScript", "SQL", "Docker", "Git", "REST APIs", "Tailwind CSS"]),
        "stats": json.dumps({"matchRate": 92, "applications": 3, "interviews": 1, "profileScore": 88})
    }
    cursor.execute("""
    INSERT OR REPLACE INTO students (id, name, email, college, branch, cgpa, graduation_year, bio, skills, stats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        student["id"], student["name"], student["email"], student["college"],
        student["branch"], student["cgpa"], student["graduation_year"],
        student["bio"], student["skills"], student["stats"]
    ))

    # Seed Company
    company = {
        "id": "comp_01",
        "name": "TechNova Solutions",
        "industry": "Enterprise Software & Cloud Platforms",
        "headquarters": "Pune, Maharashtra, India",
        "website": "https://technova.example.com",
        "contact_email": "campus-careers@technova.example.com",
        "description": "Building cloud-native developer tooling, scalable microservices, and AI-accelerated workflows for global clients.",
        "stats": json.dumps({"activeJobs": 3, "totalApplicants": 47, "shortlisted": 12, "hired": 5})
    }
    cursor.execute("""
    INSERT OR REPLACE INTO companies (id, name, industry, headquarters, website, contact_email, description, stats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        company["id"], company["name"], company["industry"], company["headquarters"],
        company["website"], company["contact_email"], company["description"], company["stats"]
    ))

    # Seed Jobs
    initial_jobs = [
        {
            "id": "job_01",
            "title": "Junior Full-Stack Software Engineer",
            "company_id": "comp_01",
            "company": "TechNova Solutions",
            "department": "Engineering",
            "location": "Pune, India (Hybrid)",
            "type": "Full-Time",
            "experience": "0-1 Years (Freshers Welcome)",
            "salary": "₹7.5 - ₹10 LPA",
            "skills": json.dumps(["Python", "React", "TypeScript", "SQL", "Git", "REST APIs"]),
            "posted_date": "24 Sep 2026",
            "applicants_count": 28,
            "match_score": 95,
            "description": "Join our core engineering squad developing scalable microservices and real-time dashboards. Work closely with senior architects on Node.js/Python microservices, relational databases, and modern UI frameworks.",
            "status": "Open"
        },
        {
            "id": "job_02",
            "title": "Associate Cloud & DevOps Engineer",
            "company_id": "comp_01",
            "company": "TechNova Solutions",
            "department": "Infrastructure",
            "location": "Bengaluru, India (On-site)",
            "type": "Full-Time",
            "experience": "0-2 Years",
            "salary": "₹8.0 - ₹12 LPA",
            "skills": json.dumps(["Docker", "Kubernetes", "Linux", "Python", "CI/CD", "AWS"]),
            "posted_date": "28 Sep 2026",
            "applicants_count": 14,
            "match_score": 78,
            "description": "Architect automated CI/CD pipelines, container orchestration, and observability clusters for enterprise SaaS products.",
            "status": "Open"
        },
        {
            "id": "job_03",
            "title": "Data Analyst & Python Developer",
            "company_id": "comp_01",
            "company": "TechNova Solutions",
            "department": "Analytics",
            "location": "Mumbai, India (Remote)",
            "type": "Full-Time",
            "experience": "0-1 Years",
            "salary": "₹6.5 - ₹9 LPA",
            "skills": json.dumps(["Python", "SQL", "Pandas", "Power BI", "Data Modeling"]),
            "posted_date": "01 Oct 2026",
            "applicants_count": 19,
            "match_score": 89,
            "description": "Analyze platform recruitment telemetry, build ETL data pipelines, and develop predictive skill matching models using Python & SQL.",
            "status": "Open"
        },
        {
            "id": "job_04",
            "title": "Frontend React Developer Intern",
            "company_id": "comp_02",
            "company": "Cognify Labs",
            "department": "Product Design",
            "location": "Pune, India (Hybrid)",
            "type": "Internship (6 Months)",
            "experience": "Students / Freshers",
            "salary": "₹35,000 / month Stipend",
            "skills": json.dumps(["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"]),
            "posted_date": "02 Oct 2026",
            "applicants_count": 42,
            "match_score": 91,
            "description": "Design sleek user interfaces, collaborate on component design systems, and translate Figma mocks into high performance web applications.",
            "status": "Open"
        }
    ]

    for j in initial_jobs:
        cursor.execute("""
        INSERT OR REPLACE INTO jobs (id, title, company_id, company, department, location, type, experience, salary, skills, posted_date, applicants_count, match_score, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            j["id"], j["title"], j["company_id"], j["company"], j["department"],
            j["location"], j["type"], j["experience"], j["salary"], j["skills"],
            j["posted_date"], j["applicants_count"], j["match_score"], j["description"], j["status"]
        ))

    # Seed Applications
    initial_apps = [
        ("app_01", "job_01", "Junior Full-Stack Software Engineer", "TechNova Solutions", "Pune, India (Hybrid)", "25 Sep 2026", 95, "Interview Scheduled", "student_01", "Rahul Patil"),
        ("app_02", "job_03", "Data Analyst & Python Developer", "TechNova Solutions", "Mumbai, India (Remote)", "02 Oct 2026", 89, "Shortlisted", "student_01", "Rahul Patil"),
        ("app_03", "job_04", "Frontend React Developer Intern", "Cognify Labs", "Pune, India (Hybrid)", "03 Oct 2026", 91, "Applied", "student_01", "Rahul Patil")
    ]
    for a in initial_apps:
        cursor.execute("""
        INSERT OR REPLACE INTO applications (id, job_id, job_title, company, location, applied_on, match_score, status, student_id, student_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, a)

    # Seed Applicants
    initial_applicants = [
        ("cand_01", "job_01", "Rahul Patil", "rahul.patil@engg.pune.edu", "Pune Institute of Computer Technology", "Computer Engineering", 8.74, 95, "25 Sep 2026", "Interview Scheduled", json.dumps(["Python", "React", "TypeScript", "SQL"]), "Intermediate", "Python & React"),
        ("cand_02", "job_01", "Priya Sharma", "priya.sharma@coep.ac.in", "COEP Tech University", "Information Technology", 9.12, 92, "26 Sep 2026", "Shortlisted", json.dumps(["Java", "Spring Boot", "SQL", "Docker"]), "Advanced", "Distributed Systems"),
        ("cand_03", "job_01", "Amit Deshmukh", "amit.deshmukh@vit.edu", "Vishwakarma Institute of Technology", "Computer Science", 8.20, 84, "27 Sep 2026", "Applied", json.dumps(["Python", "Django", "JavaScript", "PostgreSQL"]), "Beginner", "Python Backend"),
        ("cand_04", "job_01", "Neha Verma", "neha.verma@spit.ac.in", "Sardar Patel Institute of Technology", "Computer Engineering", 8.90, 88, "28 Sep 2026", "Reviewing", json.dumps(["React", "Node.js", "TypeScript", "MongoDB"]), "Intermediate", "Frontend Architecture"),
    ]
    for cand in initial_applicants:
        cursor.execute("""
        INSERT OR REPLACE INTO applicants (id, job_id, name, email, college, branch, cgpa, match_score, applied_on, status, skills, experience_level, top_skill)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, cand)

    conn.commit()

# --- Query & Mutation functions for Streamlit & Node.js ---

def get_jobs(filter_status=None):
    conn = get_connection()
    cursor = conn.cursor()
    if filter_status and filter_status != "All":
        cursor.execute("SELECT * FROM jobs WHERE status = ? ORDER BY posted_date DESC", (filter_status,))
    else:
        cursor.execute("SELECT * FROM jobs ORDER BY posted_date DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        try:
            d["skills"] = json.loads(d["skills"])
        except Exception:
            d["skills"] = []
        result.append(d)
    return result

def create_job(job_data):
    conn = get_connection()
    cursor = conn.cursor()

    job_id = job_data.get("id") or f"job_{int(datetime.now().timestamp())}"
    title = job_data.get("title", "Untitled Job")
    company = job_data.get("company", "TechNova Solutions")
    company_id = job_data.get("company_id", "comp_01")
    department = job_data.get("department", "Engineering")
    location = job_data.get("location", "Pune, India (Hybrid)")
    job_type = job_data.get("type", "Full-Time")
    experience = job_data.get("experience", "0-1 Years")
    salary = job_data.get("salary", "₹6 - ₹9 LPA")
    skills = json.dumps(job_data.get("skills", ["Python", "SQL"]))
    posted_date = datetime.now().strftime("%d %b %Y")
    description = job_data.get("description", "Exciting new opportunity.")
    match_score = job_data.get("matchScore", 85)

    cursor.execute("""
    INSERT INTO jobs (id, title, company_id, company, department, location, type, experience, salary, skills, posted_date, applicants_count, match_score, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 'Open')
    """, (job_id, title, company_id, company, department, location, job_type, experience, salary, skills, posted_date, match_score, description))

    conn.commit()
    conn.close()
    return {"status": "ok", "job_id": job_id, "title": title}

def get_applications(student_id=None):
    conn = get_connection()
    cursor = conn.cursor()
    if student_id:
        cursor.execute("SELECT * FROM applications WHERE student_id = ? ORDER BY id DESC", (student_id,))
    else:
        cursor.execute("SELECT * FROM applications ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def apply_job(app_data):
    conn = get_connection()
    cursor = conn.cursor()

    app_id = app_data.get("id") or f"app_{int(datetime.now().timestamp())}"
    job_id = app_data.get("jobId") or app_data.get("job_id")
    job_title = app_data.get("jobTitle") or app_data.get("job_title", "Software Engineer")
    company = app_data.get("company", "TechNova Solutions")
    location = app_data.get("location", "Pune, India")
    match_score = app_data.get("matchScore", 85)
    applied_on = datetime.now().strftime("%d %b %Y")
    student_id = app_data.get("studentId", "student_01")
    student_name = app_data.get("studentName", "Rahul Patil")

    cursor.execute("""
    INSERT OR REPLACE INTO applications (id, job_id, job_title, company, location, applied_on, match_score, status, student_id, student_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Applied', ?, ?)
    """, (app_id, job_id, job_title, company, location, applied_on, match_score, student_id, student_name))

    # Also add to applicants table so company sees candidate
    cursor.execute("""
    INSERT OR REPLACE INTO applicants (id, job_id, name, email, college, branch, cgpa, match_score, applied_on, status, skills, experience_level, top_skill)
    VALUES (?, ?, ?, ?, 'PICT Pune', 'Computer Engineering', 8.74, ?, ?, 'Applied', ?, 'Intermediate', 'Python & React')
    """, (f"cand_{int(datetime.now().timestamp())}", job_id, student_name, "rahul.patil@engg.pune.edu", match_score, applied_on, json.dumps(["Python", "React", "SQL"])))

    # Increment applicant count on job
    cursor.execute("UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = ?", (job_id,))

    conn.commit()
    conn.close()
    return {"status": "ok", "app_id": app_id}

def get_applicants(job_id=None):
    conn = get_connection()
    cursor = conn.cursor()
    if job_id:
        cursor.execute("SELECT * FROM applicants WHERE job_id = ? ORDER BY match_score DESC", (job_id,))
    else:
        cursor.execute("SELECT * FROM applicants ORDER BY match_score DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        try:
            d["skills"] = json.loads(d["skills"])
        except Exception:
            d["skills"] = []
        result.append(d)
    return result

def update_applicant_status(applicant_id, new_status):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE applicants SET status = ? WHERE id = ?", (new_status, applicant_id))
    conn.commit()
    conn.close()
    return {"status": "ok", "applicant_id": applicant_id, "new_status": new_status}

def get_stats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'Open'")
    active_jobs = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM applications")
    total_apps = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM applicants")
    total_candidates = cursor.fetchone()[0]
    conn.close()
    return {
        "active_jobs": active_jobs,
        "total_applications": total_apps,
        "total_candidates": total_candidates,
        "db_file": DB_FILE,
        "db_size_kb": round(os.path.getsize(DB_FILE) / 1024, 2) if os.path.exists(DB_FILE) else 0
    }

# --- CLI Dispatcher for server.ts / Node.js child_process integration ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps(init_db()))
        sys.exit(0)

    cmd = sys.argv[1]

    try:
        if cmd == "init":
            print(json.dumps(init_db()))
        elif cmd == "get_jobs":
            filter_status = sys.argv[2] if len(sys.argv) > 2 else None
            print(json.dumps(get_jobs(filter_status)))
        elif cmd == "create_job":
            job_data = json.loads(sys.argv[2])
            print(json.dumps(create_job(job_data)))
        elif cmd == "get_applications":
            student_id = sys.argv[2] if len(sys.argv) > 2 else None
            print(json.dumps(get_applications(student_id)))
        elif cmd == "apply_job":
            app_data = json.loads(sys.argv[2])
            print(json.dumps(apply_job(app_data)))
        elif cmd == "get_applicants":
            job_id = sys.argv[2] if len(sys.argv) > 2 else None
            print(json.dumps(get_applicants(job_id)))
        elif cmd == "update_status":
            app_id = sys.argv[2]
            new_status = sys.argv[3]
            print(json.dumps(update_applicant_status(app_id, new_status)))
        elif cmd == "get_stats":
            print(json.dumps(get_stats()))
        else:
            print(json.dumps({"error": f"Unknown command: {cmd}"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
