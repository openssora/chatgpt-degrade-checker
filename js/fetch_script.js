(function () {
	// 保存原始的 fetch 方法
	const originalFetch = window.fetch;

	// 重写 fetch 方法
	window.fetch = async function (resource, options = {}) {
		const response = await originalFetch(resource, options);
		try {
			const pathsToIntercept = [
				"/backend-api/sentinel/chat-requirements",
				"backend-anon/sentinel/chat-requirements",
			];
			const isTargetPath = pathsToIntercept.some((path) =>
				resource.includes(path)
			);
			const isPostMethod = options.method?.toUpperCase() === "POST";

			if (isTargetPath && isPostMethod) {
				try {
					const clonedRes = response.clone();
					const data = await clonedRes.json();
					const difficulty = data.proofofwork?.difficulty || "未知";
					const persona = data.persona || "未知";
					window.postMessage({ difficulty, persona }, "*");
				} catch (error) {
					console.error("处理响应数据时发生错误:", error);
				}
			}
		} catch (error) {
			console.error("Fetch 请求失败:", error);
		}
		return response;
	};
})();
