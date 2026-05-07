/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// [선생님 명단]
const initialTeachers = [
  "김철수", "이영희", "박지민", "최유정", "정우성",
  "한소희", "강하늘", "유재석", "신민아", "조세호",
  "이광수", "송지효", "김종국", "하동훈", "양세찬",
  "전소민", "지석진", "김희철", "민경훈", "이상민"
];

// 에디토리얼 테마용 버튼 배경색 색상표
const gridColors = [
  'bg-[#E9EDC9]', 'bg-[#FEFAE0]', 'bg-[#FAEDCD]', 'bg-[#D4A373]/20', 
  'bg-[#E0E2EE]', 'bg-[#F3E9FD]', 'bg-[#E7F3EF]', 'bg-[#FDE9E9]'
];

export default function App() {
  const [callingTeacher, setCallingTeacher] = useState<string | null>(null);
  const [sortedTeachers, setSortedTeachers] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // 가나다 순 정렬
    const sorted = [...initialTeachers].sort((a, b) => a.localeCompare(b, 'ko'));
    setSortedTeachers(sorted);

    // 시계 업데이트 로직
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const callTeacher = (name: string) => {
    if (callingTeacher) return;
    setCallingTeacher(name);

    const message = `${name} 선생님! 학생 호출이 있습니다.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);

    setTimeout(() => {
      setCallingTeacher(null);
    }, 3000);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FAF8F5] overflow-hidden select-none">
      {/* 헤더: 타이포그래피 대비를 통한 세련된 구성 */}
      <header className="h-32 px-8 md:px-12 flex items-center justify-between border-b border-[#2C2C2C]/10 shrink-0">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A5A58D]">
            Smart Call System
          </span>
          <h1 className="text-3xl md:text-4xl font-serif italic tracking-tight text-[#4A4A3C]">
            교사 호출 시스템
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-2xl font-light tabular-nums text-[#6B705C]">
            {currentTime}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#A5A58D]">
            Sejong Elementary School
          </div>
        </div>
      </header>

      {/* 메인: 구조화된 그리드 디자인 */}
      <main className="flex-1 p-8 md:p-12 bg-[#F2EDE7] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 h-fit max-w-7xl mx-auto">
          {sortedTeachers.map((name, index) => (
            <motion.button
              key={name}
              id={`teacher-btn-${name}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => callTeacher(name)}
              className={`
                h-32 border border-[#2C2C2C]/5 rounded-xl flex flex-col items-center justify-center 
                transition-all hover:border-[#2C2C2C]/20 shadow-sm
                ${gridColors[index % gridColors.length]}
              `}
            >
              <span className="text-[10px] uppercase tracking-widest text-[#2C2C2C]/40 mb-1">
                Teacher
              </span>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[#2C2C2C]">
                {name}
              </span>
            </motion.button>
          ))}
        </div>
      </main>

      {/* 푸터 & 호출 알림바 */}
      <footer className="h-24 px-8 md:px-12 flex items-center justify-center bg-white border-t border-[#2C2C2C]/10 shrink-0">
        <AnimatePresence mode="wait">
          {!callingTeacher ? (
            <motion.p
              key="default-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[#A5A58D] font-medium tracking-wide uppercase text-center"
            >
              성함을 터치하면 해당 선생님께 알림이 전송됩니다
            </motion.p>
          ) : (
            <motion.div
              key="status-bar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-[#E76F51] rounded-full animate-pulse" />
              <p className="text-lg font-medium text-[#4A4A3C]">
                <span className="font-bold">{callingTeacher}</span> 선생님을 호출 중입니다...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}

