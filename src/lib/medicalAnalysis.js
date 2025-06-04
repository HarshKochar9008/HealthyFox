import React from "react"

export const analyzeMedicalImage = (anomaly) => {
  const conditions = {
    fracture: {
      explanation: "A break or crack in the bone structure",
      symptoms: ["Pain", "Swelling", "Limited mobility", "Visible deformity"],
      complications: ["Improper healing", "Joint problems", "Chronic pain"],
      specialists: ["Orthopedic Surgeon", "Physical Therapist"],
      tests: ["X-ray", "CT scan", "MRI"],
      treatments: ["Immobilization", "Surgery", "Physical therapy"],
      lifestyle: ["Rest affected area", "Follow rehabilitation plan", "Maintain proper nutrition"]
    },
    mass: {
      explanation: "An abnormal growth or cluster of cells",
      symptoms: ["Pain", "Swelling", "Changes in surrounding tissue"],
      complications: ["Pressure on nearby structures", "Potential malignancy"],
      specialists: ["Oncologist", "Radiologist", "Surgeon"],
      tests: ["Biopsy", "PET scan", "Blood tests"],
      treatments: ["Surgery", "Radiation therapy", "Chemotherapy"],
      lifestyle: ["Regular medical check-ups", "Healthy diet", "Stress management"]
    },
    inflammation: {
      explanation: "Tissue response to injury or infection",
      symptoms: ["Pain", "Swelling", "Redness", "Heat"],
      complications: ["Chronic pain", "Tissue damage", "Reduced function"],
      specialists: ["Rheumatologist", "Physical Therapist"],
      tests: ["Blood tests", "Ultrasound", "MRI"],
      treatments: ["Anti-inflammatory medication", "Physical therapy", "Rest"],
      lifestyle: ["Regular exercise", "Anti-inflammatory diet", "Stress reduction"]
    }
  }

  const severityLevels = {
    70: "Mild",
    80: "Moderate",
    90: "Severe"
  }

  const getSeverity = (confidence) => {
    const thresholds = Object.keys(severityLevels).map(Number)
    const severity = thresholds.reduce((acc, threshold) => {
      return confidence >= threshold ? severityLevels[threshold] : acc
    }, "Mild")
    return severity
  }

  const condition = conditions[anomaly.type]
  const severity = getSeverity(anomaly.confidence)

  return {
    ...anomaly,
    severity,
    ...condition
  }
}