// 개역개정 시편 121편 데이터
const psalm121_ko = [
    "내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올까",
    "나의 도움은 천지를 지으신 여호와에게서로다",
    "여호와께서 너를 실족하지 아니하게 하시며 너를 지키시는 이가 졸지 아니하시리로다",
    "이스라엘을 지키시는 이는 졸지도 아니하시고 주무시지도 아니하시리로다",
    "여호와는 너를 지키시는 이시라 여호와께서 네 오른쪽에서 네 그늘이 되시나니",
    "낮의 해가 너를 상하게 하지 아니하며 밤의 달도 너를 해치지 아니하리로다",
    "여호와께서 너를 지켜 모든 환난을 면하게 하시며 또 네 영혼을 지키시리로다",
    "여호와께서 너의 출입을 지금부터 영원까지 지키시리로다"
];

// NIV Psalm 121 Data
const psalm121_en = [
    "I lift up my eyes to the mountains—where does my help come from?",
    "My help comes from the LORD, the Maker of heaven and earth.",
    "He will not let your foot slip—he who watches over you will not slumber;",
    "indeed, he who watches over Israel will neither slumber nor sleep.",
    "The LORD watches over you—the LORD is your shade at your right hand;",
    "the sun will not harm you by day, nor the moon by night.",
    "The LORD will keep you from all harm—he will watch over your life;",
    "the LORD will watch over your coming and going both now and forevermore."
];

const container = document.getElementById('bible-content');
let currentMode = 'read';
let totalHiddenCount = 0;
let correctCount = 0;

function changeLanguage() {
    renderVerses(currentMode);
}

function changeVerse() {
    renderVerses(currentMode);
}

function changeDifficulty() {
    if (currentMode === 'memorize') {
        renderVerses('memorize');
    }
}

function changeInteraction() {
    if (currentMode === 'memorize') {
        renderVerses('memorize');
    }
}

// 말씀을 화면에 그려주는 함수
function renderVerses(mode) {
    currentMode = mode;
    container.innerHTML = ''; // 기존 내용 지우기
    totalHiddenCount = 0;
    correctCount = 0;
    
    const lang = document.getElementById('languageSelect').value;
    const difficulty = parseFloat(document.getElementById('difficultySelect').value);
    const verseVal = document.getElementById('verseSelect').value;

    // 텍스트 처리 헬퍼 함수 (암송 모드일 때 빈칸 처리)
    const processText = (text) => {
        if (mode === 'read') return text;
        return text.split(' ').map(word => {
            if (Math.random() < difficulty) {
                totalHiddenCount++;
                return `<span class="hidden-word" data-answer="${word}" onclick="handleWordClick(this)">${word}</span>`;
            }
            return word;
        }).join(' ');
    };

    psalm121_ko.forEach((_, index) => {
        // 전체 보기가 아니고, 현재 인덱스가 선택된 절과 다르면 건너뜀
        if (verseVal !== 'all' && index !== parseInt(verseVal)) return;

        const verseDiv = document.createElement('div');
        verseDiv.className = 'verse';
        
        let verseHtml = `<span class="verse-num">${index + 1}.</span> `;
        
        if (lang === 'both') {
            verseHtml += `<span>${processText(psalm121_en[index])}</span>`;
            verseHtml += `<div style="margin-top: 8px; color: #555; font-size: 0.95em;">${processText(psalm121_ko[index])}</div>`;
        } else {
            const text = (lang === 'en') ? psalm121_en[index] : psalm121_ko[index];
            verseHtml += processText(text);
        }

        verseDiv.innerHTML = verseHtml;
        container.appendChild(verseDiv);
    });
}

// 빈칸 클릭 시 입력창으로 변환하는 함수
function handleWordClick(element) {
    // 이미 정답을 맞췄거나 입력창이 떠있으면 무시
    if (element.classList.contains('correct') || element.querySelector('input')) return;

    const answer = element.getAttribute('data-answer');
    const interactionMode = document.getElementById('interactionSelect').value;

    // 클릭 모드일 경우: 바로 정답 보여주기
    if (interactionMode === 'click') {
        element.innerHTML = answer;
        element.classList.remove('hidden-word');
        element.classList.add('correct');
        element.removeAttribute('onclick');
        
        correctCount++;
        if (correctCount === totalHiddenCount) {
            setTimeout(() => alert("축하합니다! 모든 빈칸을 채우셨습니다! 🎉"), 200);
        }
        return;
    }

    element.innerHTML = ''; // 기존 텍스트 숨김
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'word-input';
    input.value = '';
    // 정답 길이에 맞춰 입력창 너비 조절 (최소 너비 보장)
    input.style.width = Math.max(answer.length, 3) + 'ch';
    
    // 엔터키 입력 시 정답 확인
    input.onkeydown = function(e) {
        if (e.key === 'Enter') {
            checkAnswer(this, element, answer);
        }
    };
    
    // 포커스를 잃으면(다른 곳 클릭) 정답 확인
    input.onblur = function() {
        checkAnswer(this, element, answer);
    };

    element.appendChild(input);
    input.focus();
}

// 정답 확인 함수
function checkAnswer(input, container, answer) {
    const userVal = input.value.trim();
    
    // 대소문자 구분 없이 비교
    if (userVal.toLowerCase() === answer.toLowerCase()) {
        container.innerHTML = answer;
        container.classList.remove('hidden-word');
        container.classList.add('correct');
        container.removeAttribute('onclick'); // 클릭 이벤트 제거
        
        correctCount++;
        if (correctCount === totalHiddenCount) {
            setTimeout(() => alert("축하합니다! 모든 빈칸을 채우셨습니다! 🎉"), 200);
        }
    } else {
        // 틀렸을 경우: 입력값이 없으면 다시 빈칸으로, 있으면 빨간색 표시
        if (userVal === '') {
            container.innerHTML = answer; // 다시 숨겨진 텍스트로 복구
        } else {
            input.style.borderColor = '#e74c3c';
            input.style.color = '#e74c3c';
            
            input.classList.add('shake');
            setTimeout(() => {
                input.classList.remove('shake');
            }, 400);
        }
    }
}

// 처음 로딩 시 '전체 보기' 모드로 시작
renderVerses('read');