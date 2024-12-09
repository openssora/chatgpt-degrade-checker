(function () {
	"use strict";
	const _originPlatform = navigator.platform;
	const _originUserAgent = navigator.userAgent;
	const _gptTheme = localStorage.getItem("theme");

	function InitUserAgent() {
		const enabled = localStorage.getItem("randomUserAgentEnabled") === "true";
		if (enabled) {
			setRandomUserAgent(enabled);
		}
	}

	// 基础样式配置
	const STYLES = {
		button: {
			base: {
				fontSize: "11px",
				padding: "6px 12px",
				border: "1px solid #e2e8f0",
				borderRadius: "6px",
				backgroundColor: "#f8fafc",
				color: "#64748b",
				cursor: "not-allowed",
				transition: "all 0.2s ease",
				position: "relative",
				display: "flex",
				alignItems: "center",
				gap: "6px",
				fontWeight: "500",
				boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
			},
			hover: {
				backgroundColor: "#f1f5f9",
				transform: "translateY(-1px)",
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
			},
			default: {
				backgroundColor: "#f8fafc",
				transform: "translateY(0)",
				boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
			}
		},
		tooltip: {
			base: {
				visibility: "hidden",
				backgroundColor: "#1e293b",
				color: "#fff",
				textAlign: "left",
				borderRadius: "8px",
				padding: "12px",
				position: "absolute",
				zIndex: "100",
				bottom: "calc(100% + 12px)",
				left: "100%",
				transform: "translateX(-50%)",
				opacity: "0",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				fontSize: "11px",
				lineHeight: "1.6",
				boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
				border: "1px solid rgba(255, 255, 255, 0.1)",
			},
			visible: {
				visibility: "visible",
				opacity: "1"
			},
			hidden: {
				visibility: "hidden",
				opacity: "0"
			}
		}
	};
	
	// 工具函数
	const createTooltipArrow = () => `
		<div style="
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%) rotate(45deg);
		width: 10px;
		height: 10px;
		background-color: #1e293b;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		"></div>
	`;
	
	// 创建按钮的工厂函数
	function createButton({ text, icon = '', tooltipContent = '', width = "200px" }) {
		const button = document.createElement("button");
		button.innerHTML = icon + text;
		Object.assign(button.style, STYLES.button.base);
	
		const tooltip = document.createElement("div");
		Object.assign(tooltip.style, STYLES.tooltip.base, { width });
		tooltip.innerHTML = createTooltipArrow() + tooltipContent;
		
		// 添加交互事件
		button.addEventListener("mouseenter", () => {
			Object.assign(button.style, STYLES.button.hover);
			Object.assign(tooltip.style, STYLES.tooltip.visible);
		});
	
		button.addEventListener("mouseleave", () => {
			Object.assign(button.style, STYLES.button.default);
			Object.assign(tooltip.style, STYLES.tooltip.hidden);
		});
	
		button.appendChild(tooltip);
		return button;
	}
	
	// 按钮配置
	const BUTTONS_CONFIG = {
		unlock: {
			text: "解除降智方法",
			tooltipContent: `
				<div style="position: relative;">
				<div style="font-weight: 600; margin-bottom: 8px; color: #60a5fa;">推荐解决方案</div>
				<div style="margin-bottom: 4px;">1. 切换到ChatGPT APP版本</div>
				<div style="margin-bottom: 4px;">2. 切换到较为稳定的IP</div>
				<div style="margin-bottom: 4px;">3. 使用 Mac 桌面版本</div>
				<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
					<a href="https://upchatgpt.cn" target="_blank" style="color: #60a5fa; text-decoration: none;">
					查看更多解决方案 →
					</a>
				</div>
				</div>
			`,
			width: "150px"
		},
		monitor: {
			text: "状态监控介绍",
			icon: `
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
				stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			`,
			tooltipContent: `
				<div style="position: relative;">
				状态监控功能描述：<br>ChatGPT官方服务状态监控,提供实时状态信息,帮助用户了解ChatGPT服务的运行情况。
				</div>
			`,
			width: "200px"
		}
	};
	
	// 创建按钮组
	function createButtonGroup(unlockFeature) {
		const toggleSwitch = createButton(BUTTONS_CONFIG.unlock);
		const gptMonitorTipButton = createButton(BUTTONS_CONFIG.monitor);
	
		unlockFeature.style.gap = "8px";
		unlockFeature.appendChild(toggleSwitch);
		unlockFeature.appendChild(gptMonitorTipButton);
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

		// // 功能描述按钮组 下线
		// const unlockFeature = document.createElement("div");
		// Object.assign(unlockFeature.style, {
		// 	marginTop: "8px",
		// 	padding: "8px 0",
		// 	borderTop: "1px solid #ddd",
		// 	display: "flex",
		// 	alignItems: "center",
		// 	justifyContent: "space-between",
		// });
		// createButtonGroup(unlockFeature);


		// ======添加 ChatGPT 服务状态监控元素========
		const ChatGPTStatusText = document.createElement("div");
		ChatGPTStatusText.innerHTML = `
		<div style="text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px">ChatGPT官方服务状态监控</div>
		<div>状态：<span style="color:${gpt_indicator_color}">${gpt_indicator_text}</span></div>
		<div>事件描述：<span style="color:${gpt_indicator_color};font-size: 10px;">${gpt_description}</span></div>
		`;
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
			backgroundColor: _gptTheme === "dark" ? "rgba(0, 0, 0, 0.8)" : "#fff",
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
		contactInfo.innerHTML = `
		<div style="display: flex; gap: 12px; justify-content: center;">
			<a href="https://upchatgpt.cn/how-pay-upgrade-chatgpt-in-openai/" 
			target="_blank" 
			style="display: flex; align-items: center; gap: 4px; padding: 6px 10px; font-size: 11px; color: #fff; background-color: #2563eb; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);"
			onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(37, 99, 235, 0.3)';"
			onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(37, 99, 235, 0.2)';">
				GPT 升级教程
			</a>
			<a href="https://upchatgpt.cn/img/qrcode-gzh.png" 
			target="_blank" 
			style="display: flex; align-items: center; gap: 4px; padding: 6px 10px; font-size: 11px; color: #fff; background-color: #2563eb; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);"
			onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(37, 99, 235, 0.3)';"
			onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(37, 99, 235, 0.2)';">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				联系作者
			</a>
		</div>`;
	

		content.appendChild(difficultyText);
		content.appendChild(riskLevelText);
		content.appendChild(userTypeText);
		content.appendChild(ChatGPTStatusText); // 添加服务状态监控
		// content.appendChild(unlockFeature); // 功能描述按钮组, 下线
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
				<div style="text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px">ChatGPT官方服务状态监控</div>
				<div>状态：<span style="color:${gpt_indicator_color}">${gpt_indicator_text}</span></div>
				<div>事件描述：<span style="color:${gpt_indicator_color};font-size: 10px;">${newData.gpt_description}</span></div>
				<div>影响范围：<span font-size: 10px;">${newData.gpt_impact_range}</span></div>
				<div>发生时间：<span font-size: 10px;">${newData.gpt_create_at}</span></div>
				<div>处理结果：<span font-size: 10px;">${newData.gpt_process_status}</span></div>
				`;;
			}
		};

		// 更新主题背景
		accordion.updateTheme = function (theme) {
			Object.assign(content.style, {
				backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "#fff",
			});
		}

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
		powDifficulty: "012328",
		userType: "未知",
		gpt_indicator: "none",
		gpt_description: "All Systems Operational",
	};
	const accordion = createAccordion(mockInitData);
	// InitUserAgent(); // 2024-12-03 暂时下线

	// 接收 message
	window.addEventListener("message", function (e) {
		if (e.data.type == "localStorageChange") {
			const key = e.data.key;
			const value = e.data.newValue;
			if (key === "theme") {
				accordion.updateTheme(value);
			}
		} else {
			const difficulty = e.data.difficulty;
			const persona = e.data.persona;
			accordion.set({
				powDifficulty: difficulty,
				userType: persona,
			});
		}
	});

	// 获取gpt的status信息 （下线）
	async function fetchChatGPTStatus() {
		try {
			const response = await fetch(
				"https://status.openai.com/api/v2/status.json"
			);
			if (!response.ok) {
				console.log(`HTTP error! status: ${response.status}`);
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

	// 太平洋时间转换当前浏览器本地时区时间
	function transformPacificTime(time) {
		const pacificTime = new Date(time);
		return pacificTime.toLocaleString();
	}

	// 计算当前GPT解决问题之后的时间是否大于3天
	function resolvedTimeIsGreaterThan3Days(resolvedTime) {
		const currentTime = new Date();
		const resolvedDate = new Date(resolvedTime);
		const timeDifference = currentTime - resolvedDate;
		const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
		return timeDifference > threeDaysInMilliseconds;
	}

	// 获取GPT近期发生的事件
	async function fetchChatGPTByIncidents() {
		try {
			const response = await fetch(
				"https://status.openai.com/api/v2/incidents.json"
			);
			if (!response.ok) {
				console.log(`HTTP error! incidents: ${response.status}`);
				return;
			}
			const data = await response.json();
			const incidents = data.incidents || [];
			if (incidents.length) {
				const firstIncident = incidents[0];
				const indicator = firstIncident.impact;
				const impactRange = firstIncident.components?.map(c => c.name).join("、");
				const description = firstIncident.name; // 事件描述
				const processStatus = firstIncident.status; // 处理状态
				const created_at = firstIncident.monitoring_at;	// 发生时间
				const resolved_at = firstIncident.resolved_at; // 解决时间

				// 当最近的问题被解决了，且时间大于3天之后，则不再显示
				if (processStatus === "resolved" && resolvedTimeIsGreaterThan3Days(resolved_at)) {
					return;
				} 
				accordion.setGPTStatus({
					gpt_indicator: indicator,
					gpt_description: description,
					gpt_impact_range: impactRange,
					gpt_process_status: processStatus,
					gpt_create_at: transformPacificTime(created_at),
				});
				
			}
		} catch (error) {
			console.log("Error fetching incidents:", error);
		}
	}

	// 异步执行，防止阻塞
	setTimeout(() => {
		fetchChatGPTByIncidents();
	}, 3e3);
	
})();
