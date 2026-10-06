"""
SkillMatch - College Recruitment & Skill Matching Platform
Hosted on Streamlit Community Cloud / Streamlit Server
Connected to SQLite Database (database.py)
"""

import streamlit as st
import pandas as pd
import json
import os
from datetime import datetime

# Import SQLite database layer
import database as db

# Page Setup
st.set_page_config(
    page_title="SkillMatch - Campus Recruitment Platform",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for polished recruitment portal styling to match the React UI
st.markdown("""
<style>
    /* Global font & background */
    .stApp {
        background-color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    /* Top branded ribbon */
    .brand-banner {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
        padding: 20px 24px;
        border-radius: 8px;
        color: white;
        margin-bottom: 24px;
        border: 1px solid #1e293b;
    }
    .brand-title {
        font-size: 1.8rem;
        font-weight: 800;
        letter-spacing: -0.025em;
        margin: 0;
        color: #ffffff;
    }
    .brand-subtitle {
        color: #94a3b8;
        font-size: 0.85rem;
        margin-top: 4px;
    }

    /* Headings */
    .main-header {
        font-size: 1.8rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 0.95rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }

    /* Primary buttons matching React app */
    div[data-testid="stButton"] > button {
        background-color: #1e40af !important;
        color: #ffffff !important;
        border-radius: 6px !important;
        font-weight: 600 !important;
        border: 1px solid #1d4ed8 !important;
        padding: 0.45rem 1rem !important;
        transition: all 0.15s ease-in-out !important;
    }
    div[data-testid="stButton"] > button:hover {
        background-color: #1d4ed8 !important;
        border-color: #2563eb !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
    }

    /* Metric cards matching React stat boxes */
    div[data-testid="stMetric"] {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    div[data-testid="stMetric"] label {
        color: #64748b !important;
        font-size: 0.8rem !important;
        font-weight: 600 !important;
    }
    div[data-testid="stMetric"] div[data-testid="stMetricValue"] {
        color: #0f172a !important;
        font-weight: 800 !important;
    }

    /* Job & Content Cards */
    .job-card {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 18px;
        margin-bottom: 14px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .badge {
        display: inline-block;
        padding: 2px 8px;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 4px;
        margin-right: 6px;
    }
    .badge-blue { background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .badge-green { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-purple { background-color: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
</style>
""", unsafe_allow_html=True)

# Initialize database on first run
@st.cache_resource
def setup_database():
    return db.init_db()

setup_database()

# Session State Initialization
if "user_role" not in st.session_state:
    st.session_state.user_role = "student"  # 'student', 'company', 'admin', 'guest'
if "user_name" not in st.session_state:
    st.session_state.user_name = "Rahul Patil"
if "student_id" not in st.session_state:
    st.session_state.student_id = "student_01"
if "saved_jobs" not in st.session_state:
    st.session_state.saved_jobs = ["job_01", "job_03"]

# Sidebar Navigation & Role Switcher
st.sidebar.markdown("### 💼 **SkillMatch**")
st.sidebar.markdown("*College Hackathon & Recruitment Portal*")
st.sidebar.divider()

role = st.sidebar.selectbox(
    "Switch Portal Role:",
    ["Student (Rahul Patil)", "Company (TechNova Solutions)", "Administrator", "Guest / Public"],
    index=0
)

if "Student" in role:
    st.session_state.user_role = "student"
    st.session_state.user_name = "Rahul Patil"
    menu_options = ["Dashboard", "Find Jobs", "My Applications", "Skill Gap Analysis", "My Profile", "AI Career Coach", "Streamlit Server Host Info"]
elif "Company" in role:
    st.session_state.user_role = "company"
    st.session_state.user_name = "TechNova Solutions"
    menu_options = ["Company Dashboard", "Post New Job", "Manage Jobs", "Candidate Pipeline", "Streamlit Server Host Info"]
elif "Administrator" in role:
    st.session_state.user_role = "admin"
    st.session_state.user_name = "Campus Placement Admin"
    menu_options = ["Admin Analytics", "SQLite Database Inspector", "Platform Configuration", "Streamlit Server Host Info"]
else:
    st.session_state.user_role = "guest"
    st.session_state.user_name = "Guest User"
    menu_options = ["Home", "Browse Jobs", "About Platform", "Streamlit Server Host Info"]

selected_page = st.sidebar.radio("Navigation", menu_options)

st.sidebar.divider()
db_stats = db.get_stats()
st.sidebar.markdown(f"**SQLite Database:** `skillmatch.db`")
st.sidebar.caption(f"📁 Size: {db_stats['db_size_kb']} KB | 💼 Active Jobs: {db_stats['active_jobs']}")
st.sidebar.caption(f"📝 Total Apps: {db_stats['total_applications']} | 👥 Candidates: {db_stats['total_candidates']}")

# -------------------------------------------------------------
# STUDENT VIEWS
# -------------------------------------------------------------
if st.session_state.user_role == "student":
    if selected_page == "Dashboard":
        st.markdown(f"<div class='main-header'>Welcome back, {st.session_state.user_name}!</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>Pune Institute of Computer Technology (PICT) · Computer Engineering · CGPA 8.74</div>", unsafe_allow_html=True)

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Top Skill Match", "95%", "+3% this month")
        with col2:
            apps = db.get_applications(st.session_state.student_id)
            st.metric("Active Applications", len(apps))
        with col3:
            st.metric("Interviews Scheduled", 1)
        with col4:
            st.metric("Saved Jobs", len(st.session_state.saved_jobs))

        st.divider()

        # Recommended Jobs
        st.subheader("🎯 High-Fit Campus Jobs For You")
        jobs = db.get_jobs("Open")
        for job in jobs[:3]:
            with st.container():
                st.markdown(f"### {job['title']}")
                st.write(f"🏢 **{job['company']}** · 📍 {job['location']} · 💼 {job['type']} · 💰 **{job['salary']}**")
                st.write(job['description'])
                skills_html = " ".join([f"<span class='badge badge-blue'>{s}</span>" for s in job['skills']])
                st.markdown(skills_html, unsafe_allow_html=True)
                
                col_btn1, col_btn2 = st.columns([1, 4])
                with col_btn1:
                    already_applied = any(a['job_id'] == job['id'] for a in apps)
                    if already_applied:
                        st.info("Already Applied")
                    else:
                        if st.button("Apply Now", key=f"apply_{job['id']}"):
                            res = db.apply_job({
                                "jobId": job['id'],
                                "jobTitle": job['title'],
                                "company": job['company'],
                                "location": job['location'],
                                "matchScore": job['match_score'],
                                "studentId": st.session_state.student_id,
                                "studentName": st.session_state.user_name
                            })
                            st.success(f"Applied successfully to {job['title']}! Stored in SQLite database.")
                            st.rerun()
                st.markdown("---")

    elif selected_page == "Find Jobs":
        st.markdown("<div class='main-header'>Find Campus Jobs</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>Search curated opportunities matching your engineering skills.</div>", unsafe_allow_html=True)

        col_search, col_dept = st.columns([3, 1])
        with col_search:
            search_query = st.text_input("Search by Job Title or Skill keyword:", "")
        with col_dept:
            dept_filter = st.selectbox("Department", ["All", "Engineering", "Analytics", "Infrastructure", "Product Design"])

        jobs = db.get_jobs("Open")
        filtered_jobs = []
        for j in jobs:
            match_search = (search_query.lower() in j['title'].lower() or 
                            search_query.lower() in j['company'].lower() or
                            any(search_query.lower() in s.lower() for s in j['skills']))
            match_dept = (dept_filter == "All" or j['department'] == dept_filter)
            if match_search and match_dept:
                filtered_jobs.append(j)

        st.caption(f"Showing {len(filtered_jobs)} open positions from SQLite database.")

        apps = db.get_applications(st.session_state.student_id)
        applied_job_ids = {a['job_id'] for a in apps}

        for job in filtered_jobs:
            with st.container():
                st.markdown(f"#### {job['title']} — {job['company']}")
                st.caption(f"📍 {job['location']} | 💼 {job['type']} | ⏳ Experience: {job['experience']} | 💰 Salary: {job['salary']} | 🎯 Fit: {job['match_score']}%")
                st.write(job['description'])
                st.markdown("**Required Skills:** " + ", ".join([f"`{s}`" for s in job['skills']]))
                
                c1, c2 = st.columns([1, 5])
                with c1:
                    if job['id'] in applied_job_ids:
                        st.info("✓ Applied")
                    else:
                        if st.button("Apply via SQLite", key=f"find_apply_{job['id']}"):
                            db.apply_job({
                                "jobId": job['id'],
                                "jobTitle": job['title'],
                                "company": job['company'],
                                "location": job['location'],
                                "matchScore": job['match_score'],
                                "studentId": st.session_state.student_id,
                                "studentName": st.session_state.user_name
                            })
                            st.success(f"Application recorded in SQLite database `skillmatch.db`!")
                            st.rerun()
                st.markdown("---")

    elif selected_page == "My Applications":
        st.markdown("<div class='main-header'>My Applications</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>Live status tracking recorded in SQLite database.</div>", unsafe_allow_html=True)

        apps = db.get_applications(st.session_state.student_id)
        if not apps:
            st.info("No applications submitted yet. Browse jobs to submit your first application!")
        else:
            df_apps = pd.DataFrame(apps)
            st.dataframe(
                df_apps[['job_title', 'company', 'location', 'applied_on', 'match_score', 'status']],
                use_container_width=True,
                column_config={
                    "job_title": "Position",
                    "company": "Company",
                    "applied_on": "Applied Date",
                    "match_score": "Match %",
                    "status": "Recruitment Status"
                }
            )

    elif selected_page == "Skill Gap Analysis":
        st.markdown("<div class='main-header'>Skill Gap Analysis</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>Compare your current tech stack with top campus hiring trends.</div>", unsafe_allow_html=True)

        st.subheader("Your Verified Skills:")
        my_skills = ["Python", "React", "TypeScript", "SQL", "Docker", "Git", "REST APIs", "Tailwind CSS"]
        st.write(" · ".join([f"**{s}**" for s in my_skills]))

        st.divider()
        st.subheader("High Demand Campus Skills in 2026:")
        col_g1, col_g2 = st.columns(2)
        with col_g1:
            st.markdown("#### Cloud & Orchestration")
            st.progress(0.75, text="Docker & Containerization (75% match)")
            st.progress(0.40, text="Kubernetes & Helm (40% match - Recommended to learn)")
            st.progress(0.60, text="AWS / GCP Fundamentals (60% match)")
        with col_g2:
            st.markdown("#### Backend & Distributed Systems")
            st.progress(0.90, text="Python & FastAPI (90% match)")
            st.progress(0.85, text="Relational SQL / PostgreSQL (85% match)")
            st.progress(0.45, text="Redis Caching (45% match - Recommended to learn)")

    elif selected_page == "My Profile":
        st.markdown("<div class='main-header'>Student Profile</div>", unsafe_allow_html=True)
        st.write(f"**Name:** {st.session_state.user_name}")
        st.write("**Institution:** Pune Institute of Computer Technology (PICT)")
        st.write("**Branch:** Computer Engineering")
        st.write("**CGPA:** 8.74 / 10.0")
        st.write("**Graduation Year:** 2027")
        st.write("**Bio:** Third-year engineering student passionate about full-stack development, distributed databases, and machine learning pipelines.")

    elif selected_page == "AI Career Coach":
        st.markdown("<div class='main-header'>AI Career Coach</div>", unsafe_allow_html=True)
        st.caption("Powered by Google Gemini with real-time campus hiring insights.")

        user_prompt = st.text_area("Ask a question about resumes, interview questions, or skill roadmaps:", "What are the most common Python and SQL interview questions for freshers in Pune/Bangalore?")
        if st.button("Generate Career Advice"):
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                try:
                    api_key = st.secrets.get("GEMINI_API_KEY")
                except Exception:
                    api_key = None

            if api_key:
                try:
                    from google import genai
                    client = genai.Client(api_key=api_key)
                    with st.spinner("Analyzing with Gemini..."):
                        response = client.models.generate_content(
                            model="gemini-2.5-flash",
                            contents=f"You are SkillMatch AI, a career advisor for Indian college engineering students. Answer clearly: {user_prompt}"
                        )
                        st.markdown(response.text)
                except Exception as e:
                    st.error(f"Gemini API error: {str(e)}")
            else:
                st.info("💡 Set `GEMINI_API_KEY` in Streamlit Cloud Secrets or `.env` to enable real-time Gemini generation.")
                st.markdown("""
                **Quick Career Coach Tips for Freshers (Python + SQL):**
                1. **Python Fundamentals:** Be prepared to explain list comprehensions vs generators, decorators, GIL basics, and OOP principles.
                2. **SQL Mastery:** Practice `JOIN`, `GROUP BY`, `HAVING`, window functions (`ROW_NUMBER()`, `DENSE_RANK()`), and indexing strategies.
                3. **System Design:** Understand how REST APIs interact with relational databases and why connection pooling matters.
                """)

# -------------------------------------------------------------
# COMPANY VIEWS
# -------------------------------------------------------------
elif st.session_state.user_role == "company":
    if selected_page == "Company Dashboard":
        st.markdown("<div class='main-header'>Company Recruitment Dashboard</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>TechNova Solutions · Pune, Maharashtra · Enterprise Cloud & Tooling</div>", unsafe_allow_html=True)

        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Active Job Openings", db_stats['active_jobs'])
        c2.metric("Total Applicants", db_stats['total_candidates'])
        c3.metric("Shortlisted Candidates", 12)
        c4.metric("Campus Offers Extended", 5)

        st.divider()
        st.subheader("Recent Candidate Submissions (SQLite Live)")
        applicants = db.get_applicants()
        if applicants:
            df_cand = pd.DataFrame(applicants)
            st.dataframe(df_cand[['name', 'college', 'branch', 'cgpa', 'match_score', 'top_skill', 'status']], use_container_width=True)

    elif selected_page == "Post New Job":
        st.markdown("<div class='main-header'>Post a New Campus Job</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>Creates a new job listing immediately in the SQLite database.</div>", unsafe_allow_html=True)

        with st.form("post_job_form"):
            title = st.text_input("Job Title*", "Junior Python Backend Developer")
            department = st.selectbox("Department", ["Engineering", "Analytics", "Infrastructure", "Product Design"])
            location = st.text_input("Location*", "Pune, India (Hybrid)")
            job_type = st.selectbox("Job Type", ["Full-Time", "Internship (6 Months)", "Contract"])
            experience = st.text_input("Experience Level", "0-1 Years (Freshers)")
            salary = st.text_input("Salary / Compensation*", "₹7.0 - ₹9.5 LPA")
            skills_raw = st.text_input("Required Skills (comma-separated)*", "Python, FastAPI, SQL, Docker, Git")
            description = st.text_area("Job Description*", "We are seeking a talented junior engineer to build scalable backend services...")

            submitted = st.form_submit_button("Post Job to SQLite Database")
            if submitted:
                skills_list = [s.strip() for s in skills_raw.split(",") if s.strip()]
                res = db.create_job({
                    "title": title,
                    "company": "TechNova Solutions",
                    "company_id": "comp_01",
                    "department": department,
                    "location": location,
                    "type": job_type,
                    "experience": experience,
                    "salary": salary,
                    "skills": skills_list,
                    "description": description,
                    "matchScore": 90
                })
                st.success(f"Job '{title}' created successfully in SQLite database `skillmatch.db` (ID: {res['job_id']})!")

    elif selected_page == "Manage Jobs":
        st.markdown("<div class='main-header'>Manage Job Postings</div>", unsafe_allow_html=True)
        jobs = db.get_jobs()
        for j in jobs:
            st.markdown(f"### {j['title']} ({j['status']})")
            st.caption(f"📍 {j['location']} · 💰 {j['salary']} · 👥 {j['applicants_count']} applicants · Posted: {j['posted_date']}")
            st.write(j['description'])
            st.markdown("---")

    elif selected_page == "Candidate Pipeline":
        st.markdown("<div class='main-header'>Candidate Pipeline & Status Management</div>", unsafe_allow_html=True)
        applicants = db.get_applicants()
        for cand in applicants:
            with st.expander(f"{cand['name']} — {cand['college']} (Match: {cand['match_score']}%, Status: {cand['status']})"):
                st.write(f"📧 **Email:** {cand['email']} | 🎓 **Branch:** {cand['branch']} | 📊 **CGPA:** {cand['cgpa']}")
                st.write(f"🌟 **Top Skill:** {cand['top_skill']} | 🛠️ **Skills:** {', '.join(cand['skills'])}")
                
                new_status = st.selectbox(
                    "Update Status in SQLite:",
                    ["Applied", "Reviewing", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"],
                    index=["Applied", "Reviewing", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"].index(cand['status']) if cand['status'] in ["Applied", "Reviewing", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"] else 0,
                    key=f"status_{cand['id']}"
                )
                if st.button("Save New Status", key=f"btn_status_{cand['id']}"):
                    db.update_applicant_status(cand['id'], new_status)
                    st.success(f"Updated status of {cand['name']} to '{new_status}' in SQLite database!")
                    st.rerun()

# -------------------------------------------------------------
# ADMINISTRATOR VIEWS
# -------------------------------------------------------------
elif st.session_state.user_role == "admin":
    if selected_page == "Admin Analytics":
        st.markdown("<div class='main-header'>Placement Office Administrator</div>", unsafe_allow_html=True)
        st.markdown("<div class='sub-header'>Campus Placement Cell · Engineering Placement Statistics 2026-27</div>", unsafe_allow_html=True)

        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Registered Students", "1,240", "+45 this week")
        m2.metric("Partner Companies", "86", "+8 active")
        m3.metric("Placement Rate", "88.4%", "+4.2% YoY")
        m4.metric("Average CTC", "₹9.2 LPA", "Highest ₹42 LPA")

    elif selected_page == "SQLite Database Inspector":
        st.markdown("<div class='main-header'>SQLite Database Live Inspector</div>", unsafe_allow_html=True)
        st.markdown(f"Direct connection to **`{db.DB_FILE}`**.")

        table = st.selectbox("Select SQLite Table to Inspect:", ["jobs", "applications", "applicants", "students", "companies"])
        conn = db.get_connection()
        df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
        conn.close()

        st.write(f"**Total Records:** {len(df)}")
        st.dataframe(df, use_container_width=True)

        st.divider()
        st.subheader("Run Custom Read-Only SQL Query:")
        custom_query = st.text_input("SQL Query", f"SELECT title, company, salary, applicants_count FROM jobs WHERE status = 'Open'")
        if st.button("Execute SQL"):
            try:
                conn = db.get_connection()
                res_df = pd.read_sql_query(custom_query, conn)
                conn.close()
                st.dataframe(res_df, use_container_width=True)
            except Exception as e:
                st.error(f"SQL Error: {str(e)}")

# -------------------------------------------------------------
# STREAMLIT SERVER HOST INFO (FOR ALL ROLES)
# -------------------------------------------------------------
if selected_page == "Streamlit Server Host Info":
    st.markdown("<div class='main-header'>🚀 How to Host on Streamlit Server</div>", unsafe_allow_html=True)
    st.markdown("<div class='sub-header'>Complete step-by-step instructions to deploy this application to Streamlit Community Cloud (share.streamlit.io).</div>", unsafe_allow_html=True)

    st.markdown("""
    ### Step 1: Push Repository to GitHub
    Ensure these files exist at the root of your GitHub repository:
    - **`app.py`** — Main Streamlit application entry point.
    - **`database.py`** — SQLite database model, schema, and queries.
    - **`requirements.txt`** — Dependencies (`streamlit`, `pandas`, `google-genai`).
    - **`.streamlit/config.toml`** — Streamlit theme and server configuration.

    ### Step 2: Deploy on Streamlit Community Cloud
    1. Visit [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub.
    2. Click **New App**.
    3. Select your repository: `vanshita-Sawale07/SkillMatch` (or your fork).
    4. Set Main file path: `app.py`.
    5. In **Advanced Settings** -> **Secrets**, paste:
    ```toml
    GEMINI_API_KEY = "your-api-key-here"
    ```
    6. Click **Deploy!**

    Your SkillMatch portal with the SQLite database will be live at `https://[your-app-name].streamlit.app`.
    """)

    st.divider()
    st.subheader("📦 Download or Inspect Streamlit Files:")
    col_f1, col_f2, col_f3 = st.columns(3)
    with col_f1:
        st.code(open("requirements.txt").read(), language="text")
        st.caption("requirements.txt")
    with col_f2:
        st.code(open(".streamlit/config.toml").read(), language="toml")
        st.caption(".streamlit/config.toml")
    with col_f3:
        st.code(f"# database.py is {os.path.getsize('database.py')} bytes\n# app.py is {os.path.getsize('app.py')} bytes", language="python")
        st.caption("Application Files on Disk")
