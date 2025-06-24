export default function DashboardLoading({
  didGenerateComm,
}: {
  didGenerateComm: boolean;
}) {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* <div className="flex flex-col items-center justify-center min-h-[200px] py-10">
          <span className="text-gray-600 text-lg font-medium">
            
          </span>
        </div> */}
        <div className="space-y-8 w-full">
              <div className="w-full">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">{!didGenerateComm
              ? "Generating your comments proposals. This can take a moment..."
              : "Loading your comments proposals..."}</h1>
                  <p className="text-gray-600 mt-2">
                    Review AI-generated comments for LinkedIn posts matching your keywords
                    and preferences
                  </p>
                </div>
                    <CommentProposalsLoading />

              </div>
        </div>
      </div>
    </>
  );
}
function CommentProposalsLoading() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border p-6 animate-pulse"
        >
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-16 bg-gray-200 rounded w-full"></div>
              <div className="flex space-x-3">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
