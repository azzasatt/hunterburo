// Основной скрипт для управления темами и анимациями
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 DOM загружен, инициализация систем...');
    
    // Инициализация систем
    initThemeSystem();
    initMoodSystem();
    initHeaderNavigation();
    initAnimations();
    
    // Остальные инициализации
    populateDemoData();
    initParallax();
    initInteractiveMap();
    
    console.log('✅ Все системы инициализированы');
    debugCurrentThemes();
});

// === СИСТЕМА ТЕМ ПО ВРЕМЕНИ ===
function initThemeSystem() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('❌ Кнопка themeToggle не найдена!');
        return;
    }
    
    console.log('🕒 Инициализация системы тем по времени...');
    
    // Установка начальной темы (автоматически по времени или из сохранения)
    applyTimeTheme();
    
    // Обработчик кнопки смены темы
    themeToggle.addEventListener('click', function() {
        console.log('🔘 Клик по кнопке смены темы времени');
        cycleTimeTheme();
    });
}

function cycleTimeTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || getThemeByTime();
    let nextTheme;
    
    switch(currentTheme) {
        case 'morning':
            nextTheme = 'day';
            break;
        case 'day':
            nextTheme = 'evening';
            break;
        case 'evening':
            nextTheme = 'night';
            break;
        case 'night':
        default:
            nextTheme = 'morning';
    }
    
    // Устанавливаем тему времени и сохраняем как ручной выбор
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('timeTheme', nextTheme);
    localStorage.setItem('manualThemeSelected', 'true'); // Флаг ручного выбора
    localStorage.setItem('lastManualTheme', nextTheme); // Сохраняем последнюю ручную тему
    
    console.log('✅ Тема времени изменена вручную на:', nextTheme);
    updateHeroBackground();
}

function getThemeByTime() {
    const hour = new Date().getHours();
    let theme;
    
    if (hour >= 5 && hour < 12) {
        theme = 'morning';
    } else if (hour >= 12 && hour < 18) {
        theme = 'day';
    } else if (hour >= 18 && hour < 22) {
        theme = 'evening';
    } else {
        theme = 'night';
    }
    
    console.log('🕐 Текущий час:', hour, '-> Авто-тема:', theme);
    return theme;
}

function applyTimeTheme() {
    const manualThemeSelected = localStorage.getItem('manualThemeSelected');
    const lastManualTheme = localStorage.getItem('lastManualTheme');
    
    if (manualThemeSelected === 'true' && lastManualTheme) {
        // Если пользователь выбирал тему вручную, восстанавливаем её
        document.body.setAttribute('data-theme', lastManualTheme);
        console.log('💾 Восстановлена ручная тема времени:', lastManualTheme);
    } else {
        // Иначе устанавливаем тему по текущему времени
        const theme = getThemeByTime();
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('timeTheme', theme);
        console.log('🌅 Установлена тема по текущему времени:', theme);
    }
}

// === СИСТЕМА ТЕМ НАСТРОЕНИЯ ===
function initMoodSystem() {
    const moodToggle = document.getElementById('moodToggle');
    const moodSelector = document.querySelector('.mood-selector');
    const moodOptions = document.querySelectorAll('.mood-option');
    
    if (!moodToggle) {
        console.error('❌ Кнопка moodToggle не найдена!');
        return;
    }
    
    console.log('🌙 Инициализация системы тем настроения...');
    
    // Восстановление сохраненной темы настроения
    const savedMood = localStorage.getItem('moodTheme');
    if (savedMood) {
        applyMoodTheme(savedMood);
    } else {
        applyMoodTheme('sun');
    }
    
    // Открытие/закрытие выпадающего списка
    moodToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = moodSelector.classList.toggle('active');
        moodToggle.setAttribute('aria-expanded', isActive);
        console.log('📋 Переключение выпадающего списка настроения:', isActive ? 'открыт' : 'закрыт');
    });
    
    // Выбор темы настроения
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            console.log('🎨 Выбрана тема настроения:', mood);
            applyMoodTheme(mood);
            moodSelector.classList.remove('active');
            moodToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Закрытие выпадающего списка при клике вне его
    document.addEventListener('click', function(e) {
        if (!moodToggle.contains(e.target) && !moodSelector.contains(e.target)) {
            moodSelector.classList.remove('active');
            moodToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    function applyMoodTheme(mood) {
        console.log('🎭 Применение темы настроения:', mood);
        
        // Применяем тему настроения
        document.body.setAttribute('data-mood', mood);
        
        // Обновляем текст кнопки
        const moodName = {sun: 'Солнце', moon: 'Луна', star: 'Звезда'}[mood];
        if (moodName) {
            const moodTextElement = moodToggle.querySelector('.mood-text');
            if (moodTextElement) {
                moodTextElement.textContent = moodName;
            }
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('moodTheme', mood);
        
        // Обновляем анимации
        updateAnimations(mood);
        updateHeroBackground();
        
        console.log('✅ Тема настроения применена:', mood);
    }
}

// === АНИМАЦИИ ===
function initAnimations() {
    console.log('✨ Инициализация анимаций...');
    const savedMood = localStorage.getItem('moodTheme') || 'sun';
    updateAnimations(savedMood);
}

function updateAnimations(mood) {
    // Удаляем старые анимации
    document.querySelectorAll('.petal, .raindrop, .star').forEach(el => el.remove());
    
    switch(mood) {
        case 'sun':
            createPetalsAnimation();
            break;
        case 'moon':
            createRainAnimation();
            break;
        case 'star':
            createStarsAnimation();
            break;
    }
}

function createPetalsAnimation() {
    const container = document.body;
    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.opacity = Math.random() * 0.7 + 0.3;
        container.appendChild(petal);
    }
}

function createRainAnimation() {
    const container = document.body;
    for (let i = 0; i < 30; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = Math.random() * 100 + 'vw';
        raindrop.style.animationDelay = Math.random() * 2 + 's';
        raindrop.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(raindrop);
    }
}

function createStarsAnimation() {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        container.appendChild(star);
    }
}

// === ОБНОВЛЕНИЕ ФОНА ГЕРОЯ ===
function updateHeroBackground() {
    const heroBg = document.querySelector('.hero-bg');
    const heroOverlay = document.querySelector('.hero-overlay');
    
    if (heroBg && heroOverlay) {
        // Добавляем класс для плавного перехода
        heroBg.style.opacity = '0.7';
        heroOverlay.style.opacity = '0.7';
        
        setTimeout(() => {
            heroBg.style.opacity = '1';
            heroOverlay.style.opacity = '1';
        }, 300);
    }
    
    console.log('🎨 Обновление фона героя');
}

// === НАВИГАЦИЯ ХЕДЕРА ===
function initHeaderNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    const headerActions = document.querySelector('.header-actions');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
            
            if (headerActions) {
                headerActions.classList.toggle('mobile-visible');
            }
        });
        
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                if (headerActions) {
                    headerActions.classList.remove('mobile-visible');
                }
            });
        });
    }
}





























































///////////////////////////////////////////////////////////////////////////////////////////




  // Функция для заполнения демо-данных
  function populateDemoData() {
    // Заполнение охотников с фотографиями
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselDots = document.querySelector('.carousel-dots');
    const hunters = [
        { 
            name: 'R. Dawson', 
            specialty: 'Exorcist', 
            rating: '★★★★☆',
            experience: '15 лет опыта',
            photo: '/image/hunter1.jpg' // Замените на реальные пути к фото
        },
        { 
            name: 'E. Vance', 
            specialty: 'Demonologist', 
            rating: '★★★☆☆',
            experience: '8 лет опыта',
            photo: '/image/hunter2.jpg'
        },
        { 
            name: 'M. Chen', 
            specialty: 'Occult Tech', 
            rating: '★★★★★',
            experience: '12 лет опыта',
            photo: '/image/hunter3.jpg'
        },
        { 
            name: 'A. Petrov', 
            specialty: 'Healer', 
            rating: '★★★☆☆',
            experience: '6 лет опыта',
            photo: '/image/hunter4.jpg'
        },
        { 
            name: 'K. Tanaka', 
            specialty: 'Investigator', 
            rating: '★★★★☆',
            experience: '10 лет опыта',
            photo: '/image/hunter5.jpg'
        },
        { 
            name: 'L. Rodriguez', 
            specialty: 'Combat Specialist', 
            rating: '★★★★★',
            experience: '18 лет опыта',
            photo: '/image/hunter6.jpg'
        },
        { 
            name: 'S. Novak', 
            specialty: 'Researcher', 
            rating: '★★★☆☆',
            experience: '7 лет опыта',
            photo: '/image/hunter7.jpg'
        },
        { 
            name: 'J. Weber', 
            specialty: 'Ritual Expert', 
            rating: '★★★★☆',
            experience: '14 лет опыта',
            photo: '/image/hunter8.jpg'
        },
        { 
            name: 'C. Dalton', 
            specialty: 'Killer', 
            rating: '★★★★☆',
            experience: '9 лет опыта',
            photo: '/image/hunter9.jpg'
        }
    ];

    // Создаем карточки охотников
    hunters.forEach((hunter, index) => {
        const hunterCard = document.createElement('div');
        hunterCard.className = 'hunter-card';
        hunterCard.setAttribute('data-index', index);
        
        // Используем фото если есть, иначе аватар с инициалами
        const photoHTML = hunter.photo 
            ? `<img src="${hunter.photo}" alt="${hunter.name}" class="hunter-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
            : '';
            
        hunterCard.innerHTML = `
            ${photoHTML}
            <div class="hunter-avatar" ${hunter.photo ? 'style="display:none;"' : ''}>
                ${hunter.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3>${hunter.name}</h3>
            <span class="hunter-specialty">${hunter.specialty}</span>
            <div class="hunter-rating">${hunter.rating}</div>
            <div class="hunter-experience">${hunter.experience}</div>
        `;
        carouselTrack.appendChild(hunterCard);
    });

    // Создаем точки навигации
    hunters.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });

    // Инициализация карусели
    initCarousel();
    
    // Функция для инициализации карусели
    function initCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.hunter-card');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        let currentIndex = 0;
        let slidesToShow = 3; // Количество видимых карточек
        
        // Функция для обновления позиции карусели
        function updateCarousel() {
            if (slides.length === 0) return;
            
            const slideWidth = slides[0].offsetWidth + 25; // width + gap
            const translateX = -currentIndex * slideWidth;
            track.style.transform = `translateX(${translateX}px)`;
            
            // Обновляем активные точки
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Блокируем кнопки на границах
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= slides.length - slidesToShow;
        }
        
        // Функция перехода к конкретному слайду
        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, slides.length - slidesToShow));
            updateCarousel();
        }
        
        // Обработчики для кнопок
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - slidesToShow) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Адаптация количества видимых слайдов
        function updateSlidesToShow() {
            const width = window.innerWidth;
            if (width < 768) {
                return 1;
            } else if (width < 1024) {
                return 2;
            } else {
                return 3;
            }
        }
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            slidesToShow = updateSlidesToShow();
            updateCarousel();
        });
        
        // Инициализация
        updateCarousel();
    }
    
    // Заполнение запросов помощи
    const callsList = document.querySelector('.calls-list');
    const calls = [
      { location: 'Марсель', description: 'Need backup – possession confirmed, Level 3', priority: 'high' },
      { location: 'Прага', description: 'Strange occurrences in old town, investigation needed', priority: 'medium' },
      { location: 'Токио', description: 'Request for artifact analysis', priority: 'medium' },
      { location: 'Алматы', description: 'Обнаружен неупокоенный дух категории-4', priority: 'medium' }
    ];
    
    calls.forEach(call => {
      const callItem = document.createElement('div');
      callItem.className = 'call-item';
      callItem.innerHTML = `
        <span class="call-priority ${call.priority}">${call.priority === 'high' ? 'СРОЧНО' : 'СРЕДНИЙ'}</span>
        <h4>${call.location}</h4>
        <p>${call.description}</p>
      `;
      callsList.appendChild(callItem);
    });
    
    // Заполнение убежищ
    const safehousesList = document.querySelector('.safehouses-list');
    const safehouses = [
      { location: 'Париж', description: 'Secure location in Montmartre. Code: HUNTER-7' },
      { location: 'Нью-Йорк', description: 'Apartment in Brooklyn. Contact: █████' },
      { location: 'Стамбул', description: 'Safe house near Grand Bazaar. Requires clearance.' }
    ];
    
    safehouses.forEach(safehouse => {
      const safehouseItem = document.createElement('div');
      safehouseItem.className = 'safehouse-item';
      safehouseItem.innerHTML = `
        <h4>${safehouse.location}</h4>
        <p>${safehouse.description}</p>
      `;
      safehousesList.appendChild(safehouseItem);
    });
    
    // Заполнение форума
    const forumTopics = document.querySelector('.forum-topics');
    const topics = [
      { title: 'Новые проявления в Восточной Европе', author: 'Hunter_Alpha', date: '2023-10-15', replies: 12 },
      { title: 'Обсуждение ритуала Malphas-7', author: 'Exorcist_42', date: '2023-10-14', replies: 8 },
      { title: 'Предупреждение: Черные зоны в Южной Америке', author: 'Field_Ops', date: '2023-10-13', replies: 23 }
    ];
    
    topics.forEach(topic => {
      const topicElement = document.createElement('div');
      topicElement.className = 'forum-topic';
      topicElement.innerHTML = `
        <div class="topic-title">${topic.title}</div>
        <div class="topic-meta">Автор: ${topic.author} | ${topic.date} | Ответов: ${topic.replies}</div>
      `;
      forumTopics.appendChild(topicElement);
    });
  }




  

  // Отдельная функция для инициализации табов
function initNetworkTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок и контента
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
            
            // Находим и активируем соответствующий контент
            const tabId = btn.getAttribute('data-tab') + '-tab';
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Вызываем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initNetworkTabs();
});












// Параллакс эффект
function initParallax() {
    const parallaxBg = document.getElementById('parallaxBg');
    
    if (!parallaxBg) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5; // Скорость параллакса (можно регулировать)
        
        parallaxBg.style.transform = `translateY(${rate}px)`;
    });
}

// Вызвать функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', initParallax);



















////////////////////////////////////////////////////////////////////////////////////
/// Инициализация интерактивной карты
function initInteractiveMap() {
    const markers = document.querySelectorAll('.marker');
    const tooltip = document.getElementById('mapTooltip');
    const filters = document.querySelectorAll('.map-filters select');
    const resetBtn = document.querySelector('.reset-filters-btn');
    
    // Обработчики для маркеров
    markers.forEach(marker => {
        // Показ подсказки при наведении
        marker.addEventListener('mouseenter', function(e) {
            const type = this.getAttribute('data-type');
            const location = this.getAttribute('data-location');
            const details = this.getAttribute('data-details');
            
            const tooltipContent = `
                <strong>${location}</strong><br>
                ${details}<br>
                <em>${getTypeName(type)}</em>
            `;
            
            tooltip.innerHTML = tooltipContent;
            tooltip.classList.add('active');
            
            // Позиционирование подсказки
            const rect = this.getBoundingClientRect();
            const mapRect = document.getElementById('worldMap').getBoundingClientRect();
            
            tooltip.style.left = (rect.left - mapRect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - mapRect.top - tooltip.offsetHeight - 10) + 'px';
        });
        
        marker.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const mapRect = document.getElementById('worldMap').getBoundingClientRect();
            
            tooltip.style.left = (rect.left - mapRect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - mapRect.top - tooltip.offsetHeight - 10) + 'px';
        });
        
        marker.addEventListener('mouseleave', function() {
            tooltip.classList.remove('active');
        });
        
        // Клик по маркеру
        marker.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const location = this.getAttribute('data-location');
            const details = this.getAttribute('data-details');
            
            showMarkerDetails({
                type: type,
                location: location,
                details: details,
                threatLevel: getThreatLevel(type),
                lastUpdate: new Date().toLocaleDateString()
            });
        });
    });
    
    // Фильтрация маркеров
    filters.forEach(filter => {
        filter.addEventListener('change', filterMarkers);
    });
    
    // Сброс фильтров
    resetBtn.addEventListener('click', function() {
        filters.forEach(filter => {
            filter.value = 'all';
        });
        filterMarkers();
    });
    
    function filterMarkers() {
        const typeFilter = document.getElementById('typeFilter').value;
        const threatFilter = document.getElementById('threatFilter').value;
        
        markers.forEach(marker => {
            const type = marker.getAttribute('data-type');
            const threatLevel = getThreatLevel(type);
            let show = true;
            
            // Фильтр по типу
            if (typeFilter !== 'all' && type !== typeFilter) {
                show = false;
            }
            
            // Фильтр по уровню угрозы
            if (threatFilter !== 'all' && threatLevel !== threatFilter) {
                show = false;
            }
            
            marker.style.display = show ? 'block' : 'none';
            marker.style.opacity = show ? '1' : '0.3';
        });
    }
    
    function getThreatLevel(type) {
        const threatLevels = {
            'haunting': 'high',
            'curse': 'medium',
            'cleared': 'low',
            'blackzone': 'high'
        };
        return threatLevels[type] || 'medium';
    }
    
    function getTypeName(type) {
        const types = {
            'haunting': '🔴 Активная одержимость',
            'curse': '🟡 Потенциальное проклятие',
            'cleared': '🟢 Завершенный случай',
            'blackzone': '⚫ Черная зона'
        };
        return types[type] || 'Неизвестно';
    }
    
    function showMarkerDetails(data) {
        // Создаем модальное окно с детальной информацией
        const modal = document.createElement('div');
        modal.className = 'map-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${data.location}</h3>
                <div class="case-info">
                    <div class="info-row">
                        <span class="label">Тип активности:</span>
                        <span class="value ${data.type}">${getTypeName(data.type)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Уровень угрозы:</span>
                        <span class="value threat-${data.threatLevel}">${data.threatLevel === 'high' ? 'Высокий' : data.threatLevel === 'medium' ? 'Средний' : 'Низкий'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Описание:</span>
                        <span class="value">${data.details}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Последнее обновление:</span>
                        <span class="value">${data.lastUpdate}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary">Запросить детальный отчет</button>
                    <button class="btn-secondary">Отметить как отслеживаемое</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Закрытие модального окна
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}



////////////////////////////////////////////////////////////
// === АНИМАЦИИ ===
function initAnimations() {
console.log('✨ Инициализация анимаций...');
const savedMood = localStorage.getItem('moodTheme') || 'sun';
updateAnimations(savedMood);
}

function updateAnimations(mood) {
// Удаляем старые анимации
    // Селектор .petal найдет все лепестки, независимо от их цвета
document.querySelectorAll('.petal, .raindrop, .star').forEach(el => el.remove());

switch(mood) {
    case 'sun':
        createPetalsAnimation();
        break;
        case 'moon':
            createRainAnimation();
            break;
            case 'star':
                createStarsAnimation();
                break;
            }
}

/**
 * СОЛНЦЕ: Создает желтые и розовые лепестки
 */
function createPetalsAnimation() {
    const container = document.body;
    // Создадим 20 лепестков
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        
        // 1. Добавляем базовый класс
        petal.className = 'petal'; 
        
        // 2. Случайно выбираем цвет (желтый или розовый)
        if (Math.random() > 0.5) {
            petal.classList.add('petal--yellow');
        } else {
            petal.classList.add('petal--pink');
        }

        // 3. Задаем случайные стартовые позиции и задержки
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.opacity = Math.random() * 0.7 + 0.3;
        
        container.appendChild(petal);
    }
}

/**
 * ЛУНА: Создает капли дождя
 */
function createRainAnimation() {
    const container = document.body;
    for (let i = 0; i < 30; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = Math.random() * 100 + 'vw';
        raindrop.style.animationDelay = Math.random() * 2 + 's';
        raindrop.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(raindrop);
}
}

/**
 * ЗВЕЗДА: Создает падающие и мерцающие звезды
 */
function createStarsAnimation() {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
// Разделяем задержки, чтобы анимации не выглядели одинаково
    star.style.animationDelay = Math.random() * 3 + 's'; // Задержка для мерцания
    star.style.animationDuration = Math.random() * 3 + 2 + 's'; // Случайная скорость мерцания
    star.style.opacity = Math.random() * 0.7 + 0.3;
    container.appendChild(star);
}
}



















console.log('🚀 Все системы инициализированы!');
console.log('💡 Используйте debugThemes() для отладки тем');
console.log('💡 Используйте forceTheme("morning|day|evening|night") для принудительной смены темы');









/////////////////////////////////////////////////
// === СИСТЕМА ПЕРЕКЛЮЧЕНИЯ ПОСТОВ ПО НАСТРОЕНИЮ ===
function initMoodPosts() {
    const moodPostBtns = document.querySelectorAll('.mood-post-btn');
    const moodPostsContainers = document.querySelectorAll('.mood-posts-container');
    
    console.log('📝 Инициализация системы постов по настроению...');
    
    // Восстановление активной темы из localStorage
    const savedMood = localStorage.getItem('moodTheme') || 'sun';
    activateMoodPosts(savedMood);
    
    // Обработчики для кнопок переключения
    moodPostBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            console.log('🎭 Переключение на посты настроения:', mood);
            activateMoodPosts(mood);
        });
    });
    
    function activateMoodPosts(mood) {
        // Обновляем кнопки
        moodPostBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-mood') === mood);
        });
        
        // Обновляем контейнеры постов
        moodPostsContainers.forEach(container => {
            container.classList.toggle('active', container.id === `${mood}-posts`);
        });
        
        console.log('✅ Активны посты настроения:', mood);
    }
    
    // Синхронизация с основной системой настроения
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-mood') {
                const currentMood = document.body.getAttribute('data-mood');
                activateMoodPosts(currentMood);
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-mood']
    });
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initMoodPosts();
});



/////////////////////
// === СИСТЕМА ПОМИНАЛЬНЫХ СВЕЧЕЙ ===
function initCandleSystem() {
    const candleBtns = document.querySelectorAll('.candle-btn');
    const candleModal = document.getElementById('candleModal');
    const cancelCandleBtn = document.getElementById('cancelCandle');
    const confirmCandleBtn = document.getElementById('confirmCandle');
    const closeCandleModal = document.querySelector('.close-candle-modal');
    const candleMessageInput = document.getElementById('candleMessage');
    
    let currentHunter = null;
    
    console.log('🕯️ Инициализация системы поминальных свечей...');
    
    // Загружаем данные из localStorage
    loadCandleData();
    
    // Обработчики для кнопок свечей
    candleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hunterId = this.getAttribute('data-hunter');
            currentHunter = hunterId;
            
            // Проверяем, не ставил ли пользователь уже свечу этому охотнику
            const userCandles = JSON.parse(localStorage.getItem('userCandles') || '{}');
            if (userCandles[hunterId]) {
                showCandleMessage(hunterId, 'Вы уже зажигали свечу для этого охотника');
                return;
            }
            
            // Показываем модальное окно
            candleMessageInput.value = '';
            candleModal.classList.add('active');
        });
    });
    
    // Закрытие модального окна
    function closeModal() {
        candleModal.classList.remove('active');
        currentHunter = null;
    }
    
    closeCandleModal.addEventListener('click', closeModal);
    cancelCandleBtn.addEventListener('click', closeModal);
    
    // Клик вне модального окна
    candleModal.addEventListener('click', function(e) {
        if (e.target === candleModal) {
            closeModal();
        }
    });
    
    // Подтверждение зажжения свечи
    confirmCandleBtn.addEventListener('click', function() {
        if (!currentHunter) return;
        
        const message = candleMessageInput.value.trim();
        addCandle(currentHunter, message);
        closeModal();
    });
    
    // Enter для подтверждения
    candleMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            confirmCandleBtn.click();
        }
    });
    
    function addCandle(hunterId, message = '') {
        // Обновляем счетчик в localStorage
        const candleData = JSON.parse(localStorage.getItem('candleData') || '{}');
        if (!candleData[hunterId]) {
            candleData[hunterId] = { count: 0, messages: [] };
        }
        
        candleData[hunterId].count += 1;
        if (message) {
            candleData[hunterId].messages.push({
                text: message,
                timestamp: new Date().toISOString(),
                author: 'Анонимный охотник'
            });
        }
        
        localStorage.setItem('candleData', JSON.stringify(candleData));
        
        // Сохраняем информацию о том, что пользователь поставил свечу
        const userCandles = JSON.parse(localStorage.getItem('userCandles') || '{}');
        userCandles[hunterId] = true;
        localStorage.setItem('userCandles', JSON.stringify(userCandles));
        
        // Обновляем отображение
        updateCandleDisplay(hunterId);
        
        // Показываем сообщение
        showCandleMessage(hunterId, message || 'Свеча зажжена. Вечная память.');
        
        console.log('🕯️ Добавлена свеча для охотника:', hunterId);
    }
    
    function updateCandleDisplay(hunterId) {
        const candleData = JSON.parse(localStorage.getItem('candleData') || '{}');
        const hunterData = candleData[hunterId] || { count: 0 };
        
        const countElement = document.querySelector(`.candle-btn[data-hunter="${hunterId}"] .tribute-count`);
        if (countElement) {
            const baseCount = parseInt(countElement.getAttribute('data-count') || '0');
            const totalCount = baseCount + hunterData.count;
            countElement.textContent = `${totalCount} поминающих свечей`;
            countElement.setAttribute('data-count', totalCount);
        }
        
        // Добавляем анимацию
        const candleBtn = document.querySelector(`.candle-btn[data-hunter="${hunterId}"]`);
        candleBtn.classList.add('candle-pulse');
        setTimeout(() => {
            candleBtn.classList.remove('candle-pulse');
        }, 500);
    }
    
    function showCandleMessage(hunterId, message) {
        const messageElement = document.getElementById(`message-${hunterId}`);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.classList.add('show');
            
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
    
    function loadCandleData() {
        const candleData = JSON.parse(localStorage.getItem('candleData') || '{}');
        
        // Обновляем все счетчики при загрузке
        Object.keys(candleData).forEach(hunterId => {
            updateCandleDisplay(hunterId);
        });
        
        // Показываем общую статистику
        updateCandleStats();
    }
    
    function updateCandleStats() {
        const candleData = JSON.parse(localStorage.getItem('candleData') || '{}');
        let totalCandles = 0;
        let totalHunters = 0;
        
        Object.values(candleData).forEach(data => {
            totalCandles += data.count;
            totalHunters += 1;
        });
        
        // Создаем или обновляем блок статистики
        let statsElement = document.querySelector('.candle-stats');
        if (!statsElement) {
            statsElement = document.createElement('div');
            statsElement.className = 'candle-stats';
            statsElement.innerHTML = `
                <div class="stat-item">
                    <span class="stat-number" id="totalCandles">${totalCandles}</span>
                    <span class="stat-label">Всего свечей</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="totalHunters">${totalHunters}</span>
                    <span class="stat-label">Почтенных охотников</span>
                </div>
            `;
            document.getElementById('moon-posts').appendChild(statsElement);
        } else {
            document.getElementById('totalCandles').textContent = totalCandles;
            document.getElementById('totalHunters').textContent = totalHunters;
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initCandleSystem();
});







// === АНИМАЦИИ ДЛЯ ТЕМ НАСТРОЕНИЯ ===
function initAnimations() {
    console.log('✨ Инициализация анимаций...');
    const savedMood = localStorage.getItem('moodTheme') || 'sun';
    updateAnimations(savedMood);
}

function updateAnimations(mood) {
    // Удаляем старые анимации
    document.querySelectorAll('.petal, .raindrop, .star').forEach(el => el.remove());
    
    switch(mood) {
        case 'sun':
            createPetalsAnimation();
            break;
        case 'moon':
            createRainAnimation();
            break;
        case 'star':
            createStarsAnimation();
            break;
    }
    
    console.log('🎭 Обновлены анимации для темы:', mood);
}

/**
 * СОЛНЦЕ: Анимация желто-бордовых лепестков
 */
function createPetalsAnimation() {
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Случайный выбор цвета лепестка
        const colors = ['petal--yellow', 'petal--pink', 'petal--orange', 'petal--red'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        petal.classList.add(randomColor);
        
        // Случайные параметры анимации
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDelay = Math.random() * 8 + 's';
        petal.style.animationDuration = (Math.random() * 5 + 10) + 's'; // 10-15 секунд
        petal.style.opacity = Math.random() * 0.6 + 0.3;
        petal.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.7})`;
        
        container.appendChild(petal);
    }
}

/**
 * ЛУНА: Анимация дождя с разной скоростью
 */
function createRainAnimation() {
    const container = document.body;
    
    for (let i = 0; i < 35; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        
        // Разные скорости дождя
        const speed = Math.random();
        if (speed > 0.7) {
            raindrop.classList.add('fast');
        } else if (speed < 0.3) {
            raindrop.classList.add('slow');
        }
        
        // Случайные параметры
        raindrop.style.left = Math.random() * 100 + 'vw';
        raindrop.style.animationDelay = Math.random() * 3 + 's';
        raindrop.style.opacity = Math.random() * 0.4 + 0.2;
        raindrop.style.height = (Math.random() * 10 + 15) + 'px';
        
        container.appendChild(raindrop);
    }
}

/**
 * ЗВЕЗДА: Анимация мерцающих звезд и искр
 */
function createStarsAnimation() {
    const container = document.body;
    
    for (let i = 0; i < 25; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Разные размеры звезд
        const size = Math.random();
        if (size > 0.7) {
            star.classList.add('large');
        } else if (size < 0.3) {
            star.classList.add('small');
        }
        
        // Разные цвета звезд
        const color = Math.random();
        if (color > 0.8) {
            star.classList.add('gold');
        } else if (color > 0.6) {
            star.classList.add('blue');
        }
        
        // Случайные параметры
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = `${Math.random() * 2 + 2}s, ${Math.random() * 6 + 8}s`;
        star.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(star);
    }
}

// === АНИМАЦИИ ДЛЯ КОНТЕНТА ===
function initContentAnimations() {
    // Анимация появления карточек при загрузке
    const cards = document.querySelectorAll('.post-card, .memorial-card, .news-card');
    
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
    
    // Анимация для кнопок свечей
    const candleBtns = document.querySelectorAll('.candle-btn');
    candleBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.animation = 'candleFlicker 0.8s ease-in-out infinite';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initContentAnimations();
});

// === ОБНОВЛЕНИЕ АНИМАЦИЙ ПРИ СМЕНЕ ТЕМЫ ===
// Эта функция будет вызываться при смене темы настроения
function refreshAnimationsForMood(mood) {
    updateAnimations(mood);
}

// Функция для принудительного обновления анимаций (для отладки)
function refreshAnimations() {
    const currentMood = document.body.getAttribute('data-mood') || 'sun';
    updateAnimations(currentMood);
    console.log('🔄 Анимации обновлены вручную');
}

// Глобальная функция для отладки
window.debugAnimations = function() {
    console.log('🎭 Отладка анимаций:');
    console.log('Текущая тема:', document.body.getAttribute('data-mood'));
    console.log('Количество лепестков:', document.querySelectorAll('.petal').length);
    console.log('Количество капель:', document.querySelectorAll('.raindrop').length);
    console.log('Количество звезд:', document.querySelectorAll('.star').length);
};