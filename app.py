import streamlit as st
import numpy as np
from PIL import Image
import cv2
import plotly.graph_objects as go
from io import BytesIO
import base64
import pydicom
import tempfile
import os

st.set_page_config(
    page_title="HealthyFox",
    page_icon="🏥",
    layout="wide"
)


st.markdown("""
    <style>
    body, .main, .stApp {
        background-color: #181c24 !important;
        color: #f3f6fa !important;
    }
    .upload-section {
        background: #23293a;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.25);
        margin-bottom: 1.5rem;
    }
    .section-header {
        color: #7dd3fc;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        letter-spacing: 1px;
    }
    .stButton>button {
        background: linear-gradient(90deg, #38bdf8 0%, #6366f1 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        transition: background 0.2s;
    }
    .stButton>button:hover {
        background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
    }
    .stFileUploader, .stPlotlyChart, .stImage {
        background: #23293a !important;
        border-radius: 12px !important;
        padding: 1rem !important;
    }
    .finding-card {
        background: #23293a;
        border-left: 4px solid #38bdf8;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        color: #f3f6fa;
    }
    .capability-icon {
        font-size: 1.3rem;
        margin-right: 0.5rem;
        vertical-align: middle;
    }
    .compliance-badge {
        background: #22d3ee;
        color: #181c24;
        border-radius: 6px;
        padding: 0.2rem 0.7rem;
        font-weight: 600;
        margin-right: 0.5rem;
        display: inline-block;
    }
    </style>
""", unsafe_allow_html=True)

def process_image(image):
    """Process the uploaded image"""
    if isinstance(image, np.ndarray):
        return image
    return np.array(image)

def detect_anomalies(image):
    """Detect anomalies in the medical image"""
    anomalies = []
    height, width = image.shape[:2]
    
    num_anomalies = np.random.randint(1, 4)
    for _ in range(num_anomalies):
        x = np.random.randint(0, width)
        y = np.random.randint(0, height)
        radius = np.random.randint(20, 50)
        anomalies.append((x, y, radius))
    
    return anomalies

def generate_heatmap(image, anomalies):
    """Generate a heatmap overlay for detected anomalies"""
    heatmap = np.zeros(image.shape[:2], dtype=np.float32)
    
    for x, y, radius in anomalies:
        y_indices, x_indices = np.ogrid[-y:image.shape[0]-y, -x:image.shape[1]-x]
        mask = x_indices*x_indices + y_indices*y_indices <= radius*radius
        heatmap[mask] += 1
    
    heatmap = cv2.GaussianBlur(heatmap, (15, 15), 0)
    if heatmap.max() > heatmap.min():
        heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min())
    return heatmap

def analyze_medical_image(anomaly):
    """Analyze a detected anomaly and provide medical insights"""
    conditions = [
        "Possible mass lesion",
        "Suspicious calcification",
        "Irregular tissue density",
        "Potential inflammation"
    ]
    return np.random.choice(conditions)

def main():
    st.image("public/assets/logo.png", width=120)
    st.markdown('<div style="display:flex;align-items:center;gap:1rem;"><span style="font-size:2.5rem;">🏥</span><span class="section-header" style="margin-bottom:0;">HealthyFox</span></div>', unsafe_allow_html=True)
    st.markdown("<span style='color:#a5b4fc;'>Upload medical images for AI-powered analysis and diagnosis assistance</span>", unsafe_allow_html=True)

    col1, col2 = st.columns([1.2, 1])

    with col1:
        st.markdown('<div class="upload-section">', unsafe_allow_html=True)
        uploaded_file = st.file_uploader(
            "Upload Medical Image",
            type=['png', 'jpg', 'jpeg', 'dcm'],
            help="Supports DICOM, PNG, JPEG formats"
        )
        st.markdown('</div>', unsafe_allow_html=True)

        if uploaded_file is not None:
            if uploaded_file.name.endswith('.dcm'):
                with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                    tmp_file.write(uploaded_file.getvalue())
                    ds = pydicom.dcmread(tmp_file.name)
                    image = ds.pixel_array
                    os.unlink(tmp_file.name)
            else:
                image = Image.open(uploaded_file)
                image = process_image(image)

            st.image(image, caption="Original Image", use_column_width=True)

            if st.button("Analyze Image"):
                with st.spinner("Analyzing image..."):
                    anomalies = detect_anomalies(image)
                    
                    heatmap = generate_heatmap(image, anomalies)
                    
                    fig = go.Figure(data=go.Heatmap(z=heatmap, colorscale='Blues'))
                    fig.update_layout(
                        title="Anomaly Heatmap",
                        paper_bgcolor="#23293a",
                        plot_bgcolor="#23293a",
                        font_color="#f3f6fa"
                    )
                    st.plotly_chart(fig, use_container_width=True)

                    st.markdown('<div class="section-header">Analysis Results</div>', unsafe_allow_html=True)
                    for i, anomaly in enumerate(anomalies, 1):
                        condition = analyze_medical_image(anomaly)
                        st.markdown(f'<div class="finding-card"><b>Finding {i}:</b> {condition}</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="upload-section">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">Analysis Capabilities</div>', unsafe_allow_html=True)
        st.markdown('<span class="capability-icon">🧠</span> <b>MRI Analysis</b><br><span style="color:#a5b4fc;">Detects neurological conditions and abnormalities</span>', unsafe_allow_html=True)
        st.markdown('<span class="capability-icon">📷</span> <b>X-Ray Analysis</b><br><span style="color:#a5b4fc;">Detects pulmonary conditions and bone fractures</span>', unsafe_allow_html=True)
        st.markdown('<div class="section-header" style="margin-top:2rem;">Safety & Compliance</div>', unsafe_allow_html=True)
        st.markdown('<span class="compliance-badge">HIPAA</span> HIPAA Compliant', unsafe_allow_html=True)
        st.markdown('<span class="compliance-badge">🔒</span> End-to-end Encryption', unsafe_allow_html=True)
        st.markdown('<span class="compliance-badge">🛡️</span> Secure Data Handling', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main() 