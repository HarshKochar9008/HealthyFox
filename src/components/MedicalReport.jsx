import React from "react"
import { motion } from "framer-motion"
import { AlertCircle, Activity, Stethoscope, ClipboardList, HeartPulse } from "lucide-react"

const MedicalReport = ({ analysis }) => {
  if (!analysis) return null

  const getSeverityColor = (severity) => {
    const colors = {
      Mild: "text-yellow-600",
      Moderate: "text-orange-600",
      Severe: "text-red-600"
    }
    return colors[severity] || colors.Mild
  }

  return (
    <div className="space-y-6 bg-white rounded-xl shadow-lg p-6">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-blue-500" />
          HealthyFox Analysis Report
        </h3>
        <p className="text-sm text-gray-600">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {analysis.map((finding, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border-b pb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold capitalize">{finding.type}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getSeverityColor(finding.severity)}`}>
                  {finding.severity} Severity
                </span>
                <span className="text-sm text-gray-600">
                  ({finding.confidence.toFixed(1)}% confidence)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                Medical Explanation
              </h5>
              <p className="text-gray-600 text-sm">{finding.explanation}</p>
            </div>

            <div>
              <h5 className="font-medium mb-2">Potential Symptoms & Complications</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h6 className="text-sm font-medium mb-2">Symptoms</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {finding.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h6 className="text-sm font-medium mb-2">Complications</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {finding.complications.map((complication, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {complication}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                Recommended Next Steps
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium mb-2">Suggested Tests</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {finding.tests.map((test, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-purple-500" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6 className="text-sm font-medium mb-2">Specialists to Consult</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {finding.specialists.map((specialist, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500" />
                        {specialist}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-blue-500" />
                Treatment & Lifestyle Recommendations
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium mb-2">Treatment Options</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {finding.treatments.map((treatment, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6 className="text-sm font-medium mb-2">Lifestyle Changes</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {finding.lifestyle.map((change, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-teal-500" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default MedicalReport