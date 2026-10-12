document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);
	gsap.registerPlugin(TextPlugin);

	const fadeIn = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeOut = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeUp = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeX = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			x: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeY = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	// Кнопки навигации по этажам (десктоп)
	const navButtons = document.querySelectorAll(".navigation__button");
	const updateButtons = document.querySelectorAll(".chat__button--update");

	if (navButtons) {
		navButtons.forEach(button => {
			button.addEventListener("click", (e) => {
				const activeButton = document.querySelector(".navigation__button.active");

				activeButton.classList.remove("active");
				e.target.classList.add("active");

				floorAnimation(e.target);
			});
		});
	}

	// Кнопки с обновлением этажа (десктоп)
	if (updateButtons) {
		updateButtons.forEach(button => {
			button.addEventListener("click", () => {
				floorUpdate(button);
			});
		});
	}

	// Кнопка навигации по этажам (мобилка)
	const navButtonMobile = document.querySelector(".js-mobile-next");
	const updateButtonMobile = document.querySelector(".js-mobile-update");

	if (navButtonMobile) {
		navButtonMobile.addEventListener("click", (e) => {
			floorAnimation(e.target, true);
		});
	}

	// Кнопка с обновлением этажа (мобилка)
	if (updateButtonMobile) {
		updateButtonMobile.addEventListener("click", () => {
			floorUpdate(true);

			updateButtonMobile.style.display = "none";
			navButtonMobile.style.display = "flex";
		});
	}

	const floorUpdate = (isMobile) => {
		// Текущий контент
		const content = document.querySelector(".floor__content.active");
		// Текущий этаж
		const floor = document.querySelector(`.building__wrapper[data-floor="${content.dataset.content}"]`);
		// Картинки до/после
		const imageBefore = floor.querySelector(".building__image--before");
		const imageAfter = floor.querySelector(".building__image--after");
		// Заголовок и текст тултипа
		const tooltipTitle = content.querySelector(".tooltip__title");
		const tooltipText = content.querySelector(".tooltip__text");
		// Чат поддержки
		const chatSolution = content.querySelector(".chat--solution");
		const chatSolutionText = chatSolution.querySelector(".chat__text");
		const chatSolutionButton = chatSolution.querySelector(".chat__button");
		// Точная высота на мобилке
		let targetHeight = 0;

		if (isMobile && chatSolution) {
			gsap.killTweensOf(chatSolution);

			// Перед анимацией подготавливаем чат поддержки, чтобы избежать мгновенного скачка padding/border
			gsap.set(chatSolution, {
				display: "block",
				visibility: "hidden",
				height: "auto",
				padding: "14px 12px 13px",
				border: "1px solid #484b6b"
			});

			// Измеряем точную высоту, которую занял чат с контентом и паддингами
			targetHeight = chatSolution.offsetHeight;

			// Возвращаем исходное скрытое состояние для старта анимации
			gsap.set(chatSolution, {
				visibility: "visible",
				height: 0,
				padding: "0px 12px",
				borderTopWidth: 0,
				borderBottomWidth: 0,
				marginBottom: "-13px",
				opacity: 0,
				y: 20
			});
		}

		// Сохраняем самые первые дефолтные тексты перед анимацией обновления
		if (!tooltipTitle.dataset.originalText) tooltipTitle.dataset.originalText = tooltipTitle.textContent.trim();
		if (!tooltipText.dataset.originalText) tooltipText.dataset.originalText = tooltipText.textContent.trim();

		// Таймлайн
		const tlUpdate = gsap.timeline({
			defaults: {
				duration: 0.4,
				ease: "power2.out"
			}
		});

		tlUpdate
			.to(imageAfter, {
				y: 0,
				duration: 1,
				ease: "bounce.out"
			})
			.to(tooltipTitle, {
				color: "#4764ff",
				duration: 1.5,
				text: { value: tooltipTitle.dataset.tooltipTitle },
				ease: "none"
			})
			.to(tooltipText, {
				duration: 1.5,
				text: { value: tooltipText.dataset.tooltipText },
				ease: "none"
			}, "<");

		if (isMobile) {
			console.log(targetHeight)
			tlUpdate
				.to(chatSolution, {
					opacity: 1,
					height: targetHeight,
					padding: "14px 12px 13px",
					borderWidth: "1px",
					borderColor: "#484b6b",
					borderStyle: "solid",
					marginBottom: "0px",
					y: 0,
					onComplete: () => {
						// После окончания возвращаем auto для адаптивности экрана
						gsap.set(chatSolution, { height: "auto" });
					}
				});
		} else {
			tlUpdate
				.to(chatSolution, {
					opacity: 1,
					y: 0
				});
		}

		tlUpdate
			.to(chatSolutionText, {
				duration: 1.5,
				text: { value: chatSolutionText.dataset.chatText },
				ease: "none"
			})
			.to(chatSolutionButton, {
				opacity: 1
			})
			.to(imageBefore, {
				opacity: 0,
				ease: "none"
			}, "+=1");
	}

	const floorInit = (content) => {
		if (!content) return;

		const title = content.querySelector(".floor__title");
		const subtitle = content.querySelector(".floor__subtitle");
		const tooltip = content.querySelector(".floor__tooltip");
		const tooltipTitle = tooltip ? tooltip.querySelector(".tooltip__title") : null;
		const tooltipText = tooltip ? tooltip.querySelector(".tooltip__text") : null;
		const chatTask = content.querySelector(".chat--task");
		const chatTaskText = chatTask ? chatTask.querySelector(".chat__text") : null;
		const chatTaskButton = chatTask ? chatTask.querySelector(".chat__button") : null;
		const chatSolution = content.querySelector(".chat--solution");
		const chatSolutionText = chatSolution.querySelector(".chat__text");
		const newsContainer = content.querySelector(".floor__news");
		const newsItems = newsContainer ? newsContainer.querySelectorAll(".news__item") : [];

		// Сброс и возврат текстов к исходным состояниям
		if (tooltipTitle) {
			// Если мы уже сохраняли оригинальный текст, берем его, иначе берем текущий текст из верстки
			if (!tooltipTitle.dataset.originalText) tooltipTitle.dataset.originalText = tooltipTitle.textContent.trim();
			tooltipTitle.textContent = tooltipTitle.dataset.originalText;
			gsap.set(tooltipTitle, { color: "" }); // Сбрасываем синий цвет от floorUpdate
		}
		if (tooltipText) {
			if (!tooltipText.dataset.originalText) tooltipText.dataset.originalText = tooltipText.textContent.trim();
			tooltipText.textContent = tooltipText.dataset.originalText;
		}
		if (chatTaskText) {
			chatTaskText.textContent = ""; // Очищаем поле под анимацию печати
		}

		// Останавливаем все текущие анимации на элементах, чтобы они не конфликтовали
		const elementsToReset = [title, subtitle, tooltip, tooltipTitle, tooltipText, chatTask, chatTaskText, chatTaskButton, chatSolution, newsContainer];
		gsap.killTweensOf(elementsToReset);
		if (newsItems.length) gsap.killTweensOf(newsItems);

		// Возвращаем начальные стили
		const innerElements = [tooltipTitle, tooltipText, chatTaskButton].filter(Boolean);
		if (innerElements.length) gsap.set(innerElements, { opacity: 0 });

		// Полностью прячем чат-решения
		if (chatSolution) {
			const chatSolutionText = chatSolution.querySelector(".chat__text");
			const chatSolutionButton = chatSolution.querySelector(".chat__button");
			gsap.set(chatSolution, { opacity: 0, y: -20 });
			if (chatSolutionText) chatSolutionText.textContent = "";
			if (chatSolutionButton) gsap.set(chatSolutionButton, { opacity: 0 });
		}

		// Сбрасываем элементы новостей для 1-го этажа
		if (newsItems.length) {
			gsap.set(newsItems, { opacity: 0, y: -20 });
		}

		const initTl = gsap.timeline({
			defaults: {
				duration: 0.4,
				ease: "power2.out"
			}
		});

		if (title) {
			initTl
				.to(title, {
					opacity: 1,
					y: 0
				});
		}

		// Для этажа с новостями
		if (newsContainer && newsItems.length) {
			initTl
				.to(chatSolution, {
					opacity: 1,
					y: 0,
					ease: "none"
				})
				.to(chatSolutionText, {
					duration: 1.5,
					text: { value: chatSolutionText.dataset.chatText },
					ease: "none"
				})
				.to(newsItems, {
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.08,
					ease: "none"
				});
		} else {
			initTl
				.to(subtitle, {
					opacity: 1,
					y: 0
				})
				.to(tooltip, {
					opacity: 1,
					y: 0
				})
				.to(tooltipTitle, {
					opacity: 1
				})
				.to(tooltipText, {
					opacity: 1
				})
				.to(chatTask, {
					opacity: 1,
					y: 0
				})
				.to(chatTaskText, {
					duration: 1.5,
					text: { value: chatTaskText.dataset.chatText },
					ease: "none"
				})
				.to(chatTaskButton, {
					opacity: 1
				});
		}
	}

	const initialContent = document.querySelector(`.floor__content[data-content="4"]`);
	if (initialContent) {
		initialContent.classList.add('active');
		floorInit(initialContent);
	}


	const buildingSection = document.querySelector(".floor__building");
	let allFloors = [];
	let originalOffsets = [];
	let currentPositions = [];
	let currentFloorNumMobile = 0;

	if (buildingSection) {
		allFloors = buildingSection.querySelectorAll('.building__wrapper[data-floor]');
		originalOffsets = Array.from(allFloors).map(floor => window.getComputedStyle(floor).bottom);
		// Массив текущего расположения этажей
		currentPositions = Array.from(allFloors);

		// На старте выставляем базовый z-index
		allFloors.forEach((floor, index) => {
			gsap.set(floor, { zIndex: index + 1 });
		});

		currentFloorNumMobile = allFloors.length - 1;
	}

	const floorAnimation = (button, isMobile) => {
		if (isMobile) {
			if (currentFloorNumMobile <= 0) {
				return;
			}

			// Следующий этаж, который становится активным и летит на самый верх
			const nextFloor = allFloors[currentFloorNumMobile - 1];
			// Находим, где он находится в структуре здания прямо сейчас
			const fromPos = currentPositions.indexOf(nextFloor);
			// Целевая позиция самый верх здания (последний индекс массива)
			const toPos = currentPositions.length - 1;

			if (fromPos === -1 || fromPos === toPos) return;

			// Сдвигаем элементы в виртуальном массиве: вырезаем активный этаж и пушим на самый верх
			currentPositions.splice(fromPos, 1);
			currentPositions.push(nextFloor);

			// Пересчитываем bottom и z-index для всех движущихся этажей
			currentPositions.forEach((floor, newIndex) => {
				// Достаем оригинальный bottom из карты высот
				const targetBottom = originalOffsets[newIndex];

				let targetZIndex = newIndex + 1; // Базовый z-index растет снизу вверх
				let easeType = "power2.out";

				// Если это наш активный взлетающий этаж
				if (floor === nextFloor) {
					targetZIndex = 15; // Максимальный z-index, чтобы перекрыть остальные этажи
					easeType = "back.out(0.4)";
				}

				gsap.to(floor, {
					bottom: targetBottom,
					zIndex: targetZIndex,
					duration: 0.6,
					ease: easeType,
					overwrite: "auto"
				});
			});

			currentFloorNumMobile--;

			// Переключение контента
			const allContents = document.querySelectorAll('.floor__content');
			const nextFloorNum = +nextFloor.dataset.floor;
			const activeContent = document.querySelector(`.floor__content[data-content="${nextFloorNum}"]`);

			allContents.forEach(content => {
				content.classList.remove('active');
			});

			if (activeContent) {
				activeContent.classList.add('active');
				// Запуск анимации элементов заново
				floorInit(activeContent);
			}

			// Показываем нужные кнопки после смены этажа
			if (currentFloorNumMobile === 0) {
				// На последнем скрываем все кнопки
				updateButtonMobile.style.display = "none";
				navButtonMobile.style.display = "none";

				// А так же убираем здание
				buildingSection.style.display = "none";
			} else {
				updateButtonMobile.style.display = "flex";
				navButtonMobile.style.display = "none";
			}
		} else {
			const currentFloorNum = +button.dataset.button;

			// Анимируем появление структуры этажей
			allFloors.forEach(floor => {
				const itemFloorNum = +floor.dataset.floor;
				itemFloorNum > currentFloorNum ? fadeOut(floor, 0.3) : fadeIn(floor, 0.3);

				// Сбрасываем картинки after на неактивных этажах в исходное положение
				if (itemFloorNum !== currentFloorNum) {
					const imageAfter = floor.querySelector(".building__image--after");
					const imageBefore = floor.querySelector(".building__image--before");

					// Останавливаем текущие анимации картинок, чтобы избежать конфликтов
					if (imageAfter) gsap.killTweensOf(imageAfter);
					if (imageBefore) gsap.killTweensOf(imageBefore);

					// Возвращаем картинку "после" наверх, а картинку "до" делаем снова видимой
					if (imageAfter) gsap.set(imageAfter, { y: () => -window.innerHeight - 300 });
					if (imageBefore) gsap.set(imageBefore, { opacity: 1 });
				}
			});

			// Переключение контента
			const allContents = document.querySelectorAll('.floor__content');
			const activeContent = document.querySelector(`.floor__content[data-content="${currentFloorNum}"]`);

			allContents.forEach(content => {
				content.classList.remove('active');
			});

			if (activeContent) {
				activeContent.classList.add('active');
				// Запуск анимации элементов заново
				floorInit(activeContent);
			}
		}
	}

	// Анимация печати логотипов
	const header = document.querySelector(".header");

	if (header) {
		const headerObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const icons = header.querySelectorAll(".js-logo-animate");

					icons.forEach(icon => {
						const chars = icon.querySelectorAll("path");

						chars.forEach((char, index) => {
							setTimeout(() => {
								char.style.display = "block";
							}, 200 * index);
						});
					});
				}
			});
		});

		headerObserver.observe(header);
	}

	// Анимация главной страницы
	const hero = document.querySelector(".hero");

	if (hero) {
		const title = hero.querySelector(".hero__title");
		const titleInner = title.textContent;
		const subtitle = hero.querySelector(".hero__subtitle");
		const text = hero.querySelector(".hero__text");
		const button = hero.querySelector(".hero__button");
		const roof = hero.querySelector(".hero__roof");
		const thing = hero.querySelectorAll(".hero__thing");
		const tooltip = hero.querySelectorAll(".hero__tooltip");
		const heroTl = gsap.timeline({
			defaults: {
				duration: 0.4,
				ease: "power2.out"
			}
		});

		const heroTl2 = gsap.timeline({
			defaults: {
				duration: 0.4,
				ease: "power2.out"
			}
		});

		title.innerHTML = "";
		heroTl
			.to(title, {
				duration: 0,
				opacity: 1
			})
			.to(title, {
				duration: 1.5,
				text: { value: titleInner },
				ease: "none"
			})
			.to(subtitle, {
				opacity: 1,
				y: 0
			})
			.to(text, {
				opacity: 1,
				y: 0
			})
			.to(button, {
				opacity: 1
			});

		heroTl2
			.to(roof, {
				y: 0,
				duration: 1,
				ease: "bounce.out"
			})
			.to(thing, {
				opacity: 1,
				stagger: 0.5
			}, "+=0.3")
			.to(tooltip, {
				opacity: 1,
				stagger: 0.5
			});
	}

	// Вебинар
	const webinar = document.querySelector(".webinar");

	if (webinar) {
		const close = webinar.querySelector(".webinar__close");

		close.addEventListener("click", () => {
			webinar.classList.add("hide");
		});

		const webinarObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					fadeIn(webinar, 0.3, 2);

					webinarObserver.unobserve(webinar);
				}
			});
		});

		webinarObserver.observe(webinar);
	}
});
