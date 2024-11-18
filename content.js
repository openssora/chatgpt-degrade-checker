(function () {
	"use strict";

	function createAccordion(data) {
		const powDifficulty = data.powDifficulty;
		const userType = data.userType;
		const ipRiskLevel = getRiskColorAndLevel(powDifficulty).ipRiskLevel;
		const riskColor = getRiskColorAndLevel(powDifficulty).color;
		// 创建外层容器
		const accordion = document.createElement("div");
		Object.assign(accordion.style, {
			maxWidth: "220px",
			border: "1px solid #ddd",
			borderRadius: "8px",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
			position: "fixed",
			top: "50%",
			right: "16px",
			transform: "translateY(-50%)",
			backgroundColor: "#fff",
			overflow: "hidden",
			fontFamily: "Arial, sans-serif",
			transition: "all 0.3s ease",
		});

		// 创建 details 元素
		const details = document.createElement("details");
		details.id = "accordion-details";
		Object.assign(details.style, {
			borderBottom: "1px solid #ddd",
		});

		// 创建 summary 元素
		const summary = document.createElement("summary");
		summary.id = "pow-summary";
		Object.assign(summary.style, {
			cursor: "pointer",
			padding: "8px 12px",
			fontSize: "12px",
			fontWeight: "bold",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			backgroundColor: "#f9f9f9",
			color: riskColor,
			position: "relative",
		});

		// 创建显示风险等级的 span
		const riskLevelDisplay = document.createElement("span");
		riskLevelDisplay.id = "pow-risk-level-display";
		riskLevelDisplay.textContent = ipRiskLevel || "未知";

		// 创建 toggleIcon 放到右边
		const toggleIcon = document.createElement("span");
		toggleIcon.textContent = "+"; // 初始符号
		Object.assign(toggleIcon.style, {
			fontSize: "12px",
			marginLeft: "10px",
			transition: "transform 0.3s ease",
		});

		summary.appendChild(document.createTextNode("当前降级风险："));
		summary.appendChild(riskLevelDisplay);
		summary.appendChild(toggleIcon); // 将符号添加到右边

		details.addEventListener("toggle", function () {
			toggleIcon.textContent = details.open ? "-" : "+"; // 根据 open 状态切换符号
			toggleIcon.style.transform = details.open
				? "rotate(90deg)"
				: "rotate(0deg)";
		});

		// 创建内容部分
		const content = document.createElement("div");
		Object.assign(content.style, {
			padding: "12px",
			fontSize: "12px",
			lineHeight: "1.6",
			backgroundColor: "#fff",
		});

		const difficultyText = document.createElement("div");
		difficultyText.innerHTML = `PoW难度: <span>${
			powDifficulty || "未知"
		}</span>`;
		const riskLevelText = document.createElement("div");
		riskLevelText.innerHTML = `IP风险等级: <span>${
			ipRiskLevel || "未知"
		}</span>`;
		const userTypeText = document.createElement("div");
		userTypeText.innerHTML = `用户类型: <span>${userType || "未知"}</span>`;
		const contactInfo = document.createElement("div");
		contactInfo.style.marginTop = "8px";
		contactInfo.style.borderTop = "1px solid #ddd";
		contactInfo.style.paddingTop = "8px";
		contactInfo.style.fontSize = "12px";
		contactInfo.style.color = "#555";
		contactInfo.innerHTML = `解除降智访问：<a href="https://upchatgpt.cn" target="_blank" style="color: #0078d7; text-decoration: none;">upchatgpt.cn</a>`;

		content.appendChild(difficultyText);
		content.appendChild(riskLevelText);
		content.appendChild(userTypeText);
		content.appendChild(contactInfo);

		details.appendChild(summary);
		details.appendChild(content);
		accordion.appendChild(details);

		document.body.appendChild(accordion);

		// 提供动态更新内容的函数
		accordion.set = function (newData) {
			if (newData.powDifficulty !== undefined) {
				const { ipRiskLevel, color } = getRiskColorAndLevel(
					newData.powDifficulty
				);
				difficultyText.innerHTML = `PoW难度: <span>${newData.powDifficulty}</span>`;
				riskLevelText.innerHTML = `IP风险等级: <span>${ipRiskLevel}</span>`;
				summary.style.color = color;
				riskLevelDisplay.textContent = ipRiskLevel;
			}
			if (newData.userType !== undefined) {
				userTypeText.innerHTML = `用户类型: <span>${newData.userType}</span>`;
			}
		};

		return accordion;
	}

	function getRiskColorAndLevel(difficulty) {
		const cleanDifficulty = difficulty.startsWith("0x")
			? difficulty.slice(2)
			: difficulty;
		const trimmedDifficulty = cleanDifficulty.replace(/^0+/, "");
		const riskLevel = trimmedDifficulty.length;
		switch (riskLevel) {
			case 0:
			case 1:
			case 2:
				return {
					color: "#e63946",
					ipRiskLevel: "高风险",
				};
			case 3:
				return {
					color: "#FAB12F",
					ipRiskLevel: "中风险",
				};
			case 4:
				return {
					color: "#859F3D",
					ipRiskLevel: "低风险",
				};
			default:
				return {
					color: "#2a9d8f",
					ipRiskLevel: "正常",
				};
		}
	}

	const mockData = {
		powDifficulty: "未知",
		userType: "未知",
	};
	const accordion = createAccordion(mockData);

	window.addEventListener("message", function (e) {
		const difficulty = e.data.difficulty;
		const persona = e.data.persona;
		accordion.set({
			powDifficulty: difficulty,
			userType: persona,
		});
	});
})();
