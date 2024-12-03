(function () {
	"use strict";
	const _originPlatform = navigator.platform;
	const _originUserAgent = navigator.userAgent;

	function InitUserAgent() {
		const enabled = localStorage.getItem("randomUserAgentEnabled") === "true";
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
			configurable: true,
		});

		// 重写 navigator.userAgent
		Object.defineProperty(navigator, "userAgent", {
			get: function () {
				return enabled ? randomUserAgent : _originUserAgent;
			},
			configurable: true,
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
		const gpt_indicator = data.gpt_indicator;
		const gpt_description = data.gpt_description;
		const { ipRiskLevel, color } = getRiskColorAndLevel(powDifficulty);
		const { gpt_indicator_color, gpt_indicator_text } = applyIndicatorColorAndText(gpt_indicator);

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
				50% { opacity: 0.6; transform: scale(0.6); }
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

		// // 开关按钮
		// let _isFeatureEnabled =
		// 	localStorage.getItem("randomUserAgentEnabled") === "true"; // 初始状态
		// const toggleSwitch = document.createElement("button");
		// toggleSwitch.textContent = _isFeatureEnabled ? "已开启" : "点击开启";
		// Object.assign(toggleSwitch.style, {
		// 	cursor: "pointer",
		// 	padding: "2px 4px",
		// 	border: "none",
		// 	borderRadius: "4px",
		// 	backgroundColor: "#0078d7",
		// 	color: "#fff",
		// 	fontSize: "10px",
		// 	disabled: true,
		// });

		const toggleSwitch = document.createElement("button");
		toggleSwitch.textContent = "点击开启";
		Object.assign(toggleSwitch.style, {
			fontSize: "10px",
			padding: "2px 4px",
			border: "1px solid #ccc",
			borderRadius: "2px",
			backgroundColor: "#f5f5f5", // 置灰背景色
			color: "#999", // 置灰文字颜色
			cursor: "not-allowed", // 鼠标样式显示禁用状态
			position: "relative", // 为tooltip定位
		});

		// // 2024-12-03 暂时下线。
		// toggleSwitch.addEventListener("click", function () {
		// 	_isFeatureEnabled = !_isFeatureEnabled;
		// 	toggleSwitch.textContent = _isFeatureEnabled ? "已开启" : "点击开启";
		// 	setRandomUserAgent(_isFeatureEnabled);
		// });

		const tooltip = document.createElement("div");
		tooltip.innerHTML = "建议人工解除降智，推荐方法：<br>1. 切换到ChatGPT APP版本<br>2. 切换到较为稳定的IP<br>"; // 将\n替换为<br>实现换行
		Object.assign(tooltip.style, {
			visibility: "hidden",
			width: "140px", // 增加宽度以适应更多内容
			backgroundColor: "rgba(0, 0, 0, 0.8)", // 半透明黑色背景
			color: "#fff",
			textAlign: "left", // 左对齐文本
			borderRadius: "4px",
			padding: "4px 8px",
			position: "absolute",
			zIndex: "100",
			bottom: "calc(100% + 8px)", // 在按钮上方显示，留出间距
			left: "10%",
			transform: "translateX(-50%)", // 水平居中
			opacity: "0",
			transition: "opacity 0.3s, visibility 0.3s",
			fontSize: "10px",
			lineHeight: "1.5", // 适当的行高
			whiteSpace: "pre-wrap", // 保留换行符
			boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // 添加阴影效果
		});
		// 添加hover事件
		toggleSwitch.addEventListener("mouseenter", function () {
			tooltip.style.visibility = "visible";
			tooltip.style.opacity = "1";
		});
	
		toggleSwitch.addEventListener("mouseleave", function () {
			tooltip.style.visibility = "hidden";
			tooltip.style.opacity = "0";
		});
	
		toggleSwitch.appendChild(tooltip);

		// 组合功能组件
		unlockFeature.appendChild(unlockTitle);
		unlockFeature.appendChild(toggleSwitch);



		// ======添加 ChatGPT 服务状态监控元素========
		const ChatGPTStatusText = document.createElement("div");
		ChatGPTStatusText.innerHTML = `
		<div style="text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px">ChatGPT内部服务状态监控</div>
		<div>当前状态：<span style="color:${gpt_indicator_color}">${gpt_indicator_text}</span></div>
		<div>状态描述：<span style="color:${gpt_indicator_color};font-size: 10px;">${gpt_description}</span></div>`;
		Object.assign(ChatGPTStatusText.style, {
			fontSize: "10px",
			lineHeight: "1.6",
			marginTop: "8px",
			padding: "4px 0",
			borderTop: "1px solid #ddd",
		});
		// ======添加 ChatGPT 服务状态监控元素========

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
		contactInfo.style.fontSize = "10px";
		contactInfo.style.color = "#555";
		contactInfo.innerHTML = `更多方法访问：<a href="https://upchatgpt.cn" target="_blank" style="color: #0078d7; text-decoration: none;">upchatgpt.cn</a>`;

		content.appendChild(difficultyText);
		content.appendChild(riskLevelText);
		content.appendChild(userTypeText);
		content.appendChild(ChatGPTStatusText); // 添加服务状态监控
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

		// 更新 ChatGPT 服务状态监控
		accordion.setGPTStatus = function (newData) {
			if (newData.gpt_indicator !== undefined) {
				const { gpt_indicator_color, gpt_indicator_text } = applyIndicatorColorAndText(newData.gpt_indicator);
				ChatGPTStatusText.innerHTML = `
				<div style="text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px">ChatGPT内部服务状态监控</div>
				<div>状态：<span style="color:${gpt_indicator_color}">${gpt_indicator_text}</span></div>
				<div>描述：<span style="color:${gpt_indicator_color};font-size: 10px;">${newData.gpt_description}</span></div>`;;
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

		if (trimmedDifficulty === "未知") {
			return {
				color: "#e63946",
				ipRiskLevel: "未知",
			};
		}
		
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

	function applyIndicatorColorAndText(indicator) {
		let color, text;
		switch (indicator) {
			case "none":
				color = "green"; // 绿色
				text = "正常";
				break;
			case "minor":
				color = "#859F3D"; // 黄色
				text = "轻微异常";
				break;
			case "major":
				color = "orange"; // 橙色
				text = "异常";
				break;
			case "critical":
				color = "red"; // 红色
				text = "严重异常";
				break;
			default:
				color = "gray"; // 灰色
				text = "未知";
		}
		return { gpt_indicator_color: color, gpt_indicator_text: text };
	}

	const mockInitData = {
		powDifficulty: "未知",
		userType: "未知",
		gpt_indicator: "none",
		gpt_description: "All Systems Operational",
	};
	const accordion = createAccordion(mockInitData);
	// InitUserAgent(); // 2024-12-03 暂时下线

	// 接收 message
	window.addEventListener("message", function (e) {
		const difficulty = e.data.difficulty;
		const persona = e.data.persona;
		accordion.set({
			powDifficulty: difficulty,
			userType: persona,
		});
	});

	// 获取gpt的status信息
	async function fetchChatGPTStatus() {
		try {
			const response = await fetch(
				"https://status.openai.com/api/v2/status.json"
			);
			if (!response.ok) {
				console.error(`HTTP error! status: ${response.status}`);
				return;
			}
			const data = await response.json();
			const status = data.status;
			if (status) {
				const indicator = status.indicator.toLowerCase(); // 当前状态：none (black), minor (yellow), major (orange), critical (red)
				const description = status.description;
				accordion.setGPTStatus({
					gpt_indicator: indicator,
					gpt_description: description,
				});
			}
		} catch (error) {
			console.log("Error fetching status:", error);
		}
	}
	fetchChatGPTStatus();
})();
