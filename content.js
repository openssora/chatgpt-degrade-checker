(function () {
	"use strict";
	const _originPlatform = navigator.platform;
	const _originUserAgent = navigator.userAgent;

	function InitUserAgent() {
		const enabled = localStorage.getItem("randomUserAgentEnabled") === 'true';
		if (enabled) {
			setRandomUserAgent(enabled);
		}
	}

	function setRandomUserAgent(enabled) {
		const iosPlatform = "iPhone";
		const iosUserAgents = [
			"Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1",
			"Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
			"Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
		];
		const randomIndex = Math.floor(Math.random() * iosUserAgents.length);
		const randomUserAgent = iosUserAgents[randomIndex];
		// 重写 navigator.platform
		Object.defineProperty(navigator, "platform", {
			get: function () {
				return enabled ? iosPlatform : _originPlatform;
			},
			configurable: true
		});

		// 重写 navigator.userAgent
		Object.defineProperty(navigator, "userAgent", {
			get: function () {
				return enabled ? randomUserAgent : _originUserAgent;
			},
			configurable: true
		});

		if (enabled) {
			console.log("已设置新的 User Agent:", randomUserAgent);
		} else {
			console.log("已恢复原始的 User Agent:", _originUserAgent);
		}

		localStorage.setItem("randomUserAgentEnabled", enabled);
	}

	function createAccordion(data) {
		const powDifficulty = data.powDifficulty;
		const userType = data.userType;
		const { ipRiskLevel, color } = getRiskColorAndLevel(powDifficulty);

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
			color,
			position: "relative",
		});

		// 创建呼吸灯
		const breathingLight = document.createElement("div");
		Object.assign(breathingLight.style, {
			width: "6px",
			height: "6px",
			borderRadius: "50%",
			marginRight: "4px",
			backgroundColor: color,
			animation: "breathing 2s infinite",
		});

		// 添加呼吸灯动画样式
		const styleTag = document.createElement("style");
		styleTag.textContent = `
			@keyframes breathing {
				0%, 100% { opacity: 1; transform: scale(1); }
				50% { opacity: 0.6; transform: scale(0.8); }
			}
		`;
		document.head.appendChild(styleTag);

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

		// 组合到 summary 中
		summary.appendChild(breathingLight); // 添加呼吸灯
		summary.appendChild(document.createTextNode("当前降级风险："));
		summary.appendChild(riskLevelDisplay);
		summary.appendChild(toggleIcon);

		details.addEventListener("toggle", function () {
			toggleIcon.textContent = details.open ? "-" : "+";
			toggleIcon.style.transform = details.open
				? "rotate(90deg)"
				: "rotate(0deg)";
		});

		// 一键解除降智功能
		const unlockFeature = document.createElement("div");
		Object.assign(unlockFeature.style, {
			marginTop: "8px",
			padding: "8px 0",
			borderTop: "1px solid #ddd",
		});

		// 功能标题
		const unlockTitle = document.createElement("span");
		unlockTitle.textContent = "智能解除降智:";
		Object.assign(unlockTitle.style, {
			marginRight: "8px",
		});

		// 开关按钮
		let _isFeatureEnabled = localStorage.getItem("randomUserAgentEnabled") === 'true'; // 初始状态
		const toggleSwitch = document.createElement("button");
		toggleSwitch.textContent = _isFeatureEnabled ? "已开启" : "点击开启";
		Object.assign(toggleSwitch.style, {
			cursor: "pointer",
			padding: "4px 8px",
			border: "none",
			borderRadius: "4px",
			backgroundColor: "#0078d7",
			color: "#fff",
			fontSize: "12px",
		});
		console.log('_isFeatureEnabled: ', _isFeatureEnabled);
		toggleSwitch.addEventListener("click", function () {
			_isFeatureEnabled = !_isFeatureEnabled;
			toggleSwitch.textContent = _isFeatureEnabled ? "已开启" : "点击开启";
			setRandomUserAgent(_isFeatureEnabled);
		});

		// 组合功能组件
		unlockFeature.appendChild(unlockTitle);
		unlockFeature.appendChild(toggleSwitch);

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
		contactInfo.style.marginTop = "0px";
		contactInfo.style.borderTop = "1px solid #ddd";
		contactInfo.style.paddingTop = "8px";
		contactInfo.style.fontSize = "12px";
		contactInfo.style.color = "#555";
		contactInfo.innerHTML = `更多方法访问：<a href="https://upchatgpt.cn" target="_blank" style="color: #0078d7; text-decoration: none;">upchatgpt.cn</a>`;

		content.appendChild(difficultyText);
		content.appendChild(riskLevelText);
		content.appendChild(userTypeText);
		content.appendChild(unlockFeature);
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
				breathingLight.style.backgroundColor = color;
				riskLevelDisplay.textContent = ipRiskLevel;
			}
			if (newData.userType !== undefined) {
				userTypeText.innerHTML = `用户类型: <span>${newData.userType}</span>`;
			}
		};

		return accordion;
	}

	// 颜色和风险等级映射逻辑保持不变
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
	InitUserAgent();

	window.addEventListener("message", function (e) {
		const difficulty = e.data.difficulty;
		const persona = e.data.persona;
		accordion.set({
			powDifficulty: difficulty,
			userType: persona,
		});
	});
})();
