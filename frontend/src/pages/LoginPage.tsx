import { useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { playerApi } from '../api/player';
import { MountainsBg, SealStamp } from '../assets/svg/mountains';

export default function LoginPage() {
  const { setPlayer, setToken } = usePlayerStore();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = isRegister
        ? await playerApi.register({ username, password, nickname: nickname || username })
        : await playerApi.login({ username, password });

      const { token, player } = res.data.data;
      setToken(token);
      setPlayer(player);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* 真山水背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        <MountainsBg />
      </div>

      {/* 左侧松树装饰 */}
      <div style={{
        position: 'absolute',
        left: '5%',
        top: '15%',
        width: '120px',
        height: '400px',
        zIndex: 2,
        opacity: 0.15
      }}>
        <svg viewBox="0 0 120 400" xmlns="http://www.w3.org/2000/svg">
          <g>
            {/* 松树主干 */}
            <path d="M55,400 L55,180 Q53,160 50,150 L55,150 L60,150 Q62,160 60,180 L60,400" fill="#2a2a2a" />
            {/* 松树枝叶 */}
            <path d="M57,150 Q30,120 20,130 Q40,100 57,120 Q74,100 94,130 Q84,120 57,150" fill="#2a2a2a" />
            <path d="M57,120 Q35,95 28,105 Q42,80 57,95 Q72,80 86,105 Q79,95 57,120" fill="#2a2a2a" />
            <path d="M57,95 Q40,75 35,82 Q45,65 57,78 Q69,65 79,82 Q74,75 57,95" fill="#2a2a2a" />
            <path d="M57,78 Q45,62 42,68 Q48,55 57,65 Q66,55 72,68 Q69,62 57,78" fill="#2a2a2a" />
            {/* 松针细节 */}
            <circle cx="45" cy="115" r="2" fill="#3a3a3a" />
            <circle cx="70" cy="108" r="1.5" fill="#3a3a3a" />
            <circle cx="55" cy="85" r="2" fill="#3a3a3a" />
          </g>
        </svg>
      </div>

      {/* 右侧竹子装饰 */}
      <div style={{
        position: 'absolute',
        right: '8%',
        top: '20%',
        width: '80px',
        height: '350px',
        zIndex: 2,
        opacity: 0.12
      }}>
        <svg viewBox="0 0 80 350" xmlns="http://www.w3.org/2000/svg">
          <g>
            {/* 竹竿 */}
            <path d="M30,350 L30,50" stroke="#3a3a3a" strokeWidth="6" fill="none" />
            <path d="M50,350 L50,80" stroke="#3a3a3a" strokeWidth="5" fill="none" />
            {/* 竹节 */}
            <line x1="25" y1="100" x2="35" y2="100" stroke="#3a3a3a" strokeWidth="2" />
            <line x1="25" y1="180" x2="35" y2="180" stroke="#3a3a3a" strokeWidth="2" />
            <line x1="25" y1="260" x2="35" y2="260" stroke="#3a3a3a" strokeWidth="2" />
            <line x1="45" y1="140" x2="55" y2="140" stroke="#3a3a3a" strokeWidth="2" />
            <line x1="45" y1="220" x2="55" y2="220" stroke="#3a3a3a" strokeWidth="2" />
            {/* 竹叶 */}
            <path d="M30,80 Q15,60 10,70 Q20,50 30,65" fill="#3a3a3a" />
            <path d="M30,80 Q45,60 50,70 Q40,50 30,65" fill="#3a3a3a" />
            <path d="M50,110 Q35,95 32,102 Q40,88 50,100" fill="#3a3a3a" />
            <path d="M50,110 Q65,95 68,102 Q60,88 50,100" fill="#3a3a3a" />
          </g>
        </svg>
      </div>

      {/* 登录框 - 卷轴 */}
      <div className="login-box" style={{ zIndex: 10 }}>
        {/* 朱砂印章装饰 */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '24px',
          zIndex: 20
        }}>
          <SealStamp text="仙" className="" />
        </div>

        <h1 className="login-title">仙侠放置录</h1>
        <div className="login-subtitle">
          {isRegister ? '踏入修仙之路' : '重回仙府'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">道号</label>
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请赐道号"
              required
            />
          </div>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">仙名</label>
              <input
                className="form-input"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入仙名"
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">密咒</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密咒"
              required
            />
          </div>
          {error && (
            <div style={{ 
              color: 'var(--cinnabar)', 
              fontSize: '0.9rem', 
              marginBottom: 16,
              padding: '12px 16px',
              background: 'rgba(139, 37, 0, 0.05)',
              borderLeft: '4px solid var(--cinnabar)',
              letterSpacing: '1px'
            }}>
              {error}
            </div>
          )}
          <button className="btn btn-primary login-btn" type="submit" disabled={loading}>
            {loading ? '施法中...' : isRegister ? '踏入仙途' : '进入仙府'}
          </button>
        </form>
        <div className="login-switch">
          {isRegister ? (
            <>已有仙缘？<a onClick={() => setIsRegister(false)}>直接入府</a></>
          ) : (
            <>初入红尘？<a onClick={() => setIsRegister(true)}>创建仙籍</a></>
          )}
        </div>

        {/* 底部祥云装饰 */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          opacity: 0.3
        }}>
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg" style={{ width: '120px' }}>
            <path d="M10,10 Q30,2 50,10 Q70,18 90,10 Q110,2 130,10 Q150,18 170,10 Q180,6 190,10" 
                  fill="none" stroke="var(--ink-light)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
