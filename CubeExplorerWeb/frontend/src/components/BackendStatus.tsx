import ControlButton from "./ControlButton";

export const BackendStatus = () => {
    return (
        <>
        {/* Connection Status */}
        <div className="border border-gray-400 rounded p-3 mb-4">
        <h3 className="text-xs font-semibold mb-2 text-gray-700">Connection Status</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">
            Connected to backend
          </span>
        </div>
      </div>

      {/* Test Backend Section */}
      <div className="border border-gray-400 rounded p-3 mb-4">
        <h3 className="text-xs font-semibold mb-3 text-gray-700">Test Backend</h3>
        <ControlButton label="Test Backend Connection" onClick={() => {
          fetch('http://localhost:3001/api/health')
            .then(res => res.json())
            .then(data => alert('Backend OK: ' + JSON.stringify(data)))
            .catch(err => alert('Backend Error: ' + err.message));
        }} />
      </div>
      </>
    )
}
