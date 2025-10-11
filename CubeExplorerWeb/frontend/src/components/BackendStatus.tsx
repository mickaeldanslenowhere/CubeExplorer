import { useLogsStream } from '../hooks/useLogsStream';

export const BackendStatus = () => {
    const { isConnected } = useLogsStream();

    return (
        <>
        {/* Connection Status */}
        <div className="border border-gray-400 rounded p-3 mb-4">
        <h3 className="text-xs font-semibold mb-2 text-gray-700">Connection Status</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          <span className="text-xs text-gray-600">
            {isConnected ? 'Connected to logs stream' : 'Connecting to logs stream...'}
          </span>
        </div>
      </div>
      </>
    )
}
