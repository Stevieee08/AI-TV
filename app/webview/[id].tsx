import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '@/store/courseStore';
import { useTheme } from '@/hooks/useTheme';
import { Course } from '@/types';

function buildCourseHTML(course: Course, isDark: boolean): string {
  const bg = isDark ? '#12141C' : '#F5F7FF';
  const card = isDark ? '#1C1F2E' : '#FFFFFF';
  const cardBorder = isDark ? '#2A2D3E' : '#E2E6FF';
  const text = isDark ? '#FFFFFF' : '#1A1D2E';
  const textSec = isDark ? '#8F92A1' : '#6B7280';
  const textMuted = isDark ? '#555873' : '#9CA3AF';
  const modBg = isDark ? '#12141C' : '#F5F7FF';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
  <title>${course.title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${bg};color:${text};padding-bottom:40px}
    .hero{position:relative;overflow:hidden}
    .hero img{width:100%;height:220px;object-fit:cover;display:block}
    .hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.7))}
    .hero-content{position:absolute;bottom:16px;left:16px;right:16px}
    .hero-content h1{font-size:18px;font-weight:700;line-height:1.3;margin-bottom:4px;color:#fff}
    .badge{display:inline-block;background:rgba(61,90,254,0.3);border:1px solid rgba(61,90,254,0.5);color:#6B7FFF;padding:3px 10px;border-radius:20px;font-size:11px;text-transform:capitalize;margin-bottom:8px}
    .body{padding:16px}
    .card{background:${card};border-radius:16px;padding:16px;margin-bottom:14px;border:1px solid ${cardBorder}}
    .section-label{font-size:10px;font-weight:700;color:${textMuted};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px}
    .stats{display:flex;align-items:center;justify-content:space-around}
    .stat{text-align:center}
    .stat-val{font-size:18px;font-weight:700;color:#3D5AFE}
    .stat-label{font-size:10px;color:${textSec};margin-top:3px}
    .divider-v{width:1px;height:32px;background:${cardBorder}}
    .progress-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
    .progress-row span{font-size:12px;color:${textSec}}
    .bar{background:${cardBorder};border-radius:8px;height:8px}
    .fill{background:linear-gradient(90deg,#3D5AFE,#6B7FFF);border-radius:8px;height:8px;width:0;transition:width 1.2s cubic-bezier(.4,0,.2,1)}
    .instructor{display:flex;align-items:center;gap:12px}
    .avatar{width:48px;height:48px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid rgba(61,90,254,0.2)}
    .avatar img{width:100%;height:100%;object-fit:cover}
    .instr-name{font-size:14px;font-weight:700;color:${text}}
    .instr-role{font-size:11px;color:#3D5AFE;margin-top:2px;text-transform:capitalize}
    .module{display:flex;align-items:center;gap:12px;padding:12px 14px;background:${modBg};border-radius:12px;margin-bottom:8px;border:1px solid ${cardBorder};cursor:pointer}
    .module:active{border-color:#3D5AFE}
    .mod-num{width:28px;height:28px;border-radius:50%;background:${card};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${textSec};flex-shrink:0;border:1px solid ${cardBorder}}
    .mod-num.active{background:#3D5AFE;color:#fff;border-color:#3D5AFE}
    .mod-title{font-size:13px;font-weight:600;flex:1;color:${text}}
    .mod-meta{font-size:10px;color:${textSec};margin-top:2px}
    .btn{display:block;width:100%;background:linear-gradient(135deg,#3D5AFE,#6B7FFF);color:#fff;border:none;padding:16px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;text-align:center;margin-top:8px}
    .btn:active{opacity:0.88}
    .btn-ghost{background:transparent;border:1.5px solid ${cardBorder};color:${textSec};margin-top:8px}
    .star-row{color:#F4A100;font-size:14px;letter-spacing:1px}
  </style>
</head>
<body>
  <div class="hero">
    <img src="${course.images?.[0] ?? course.thumbnail}" onerror="this.onerror=null;this.src='${course.thumbnail}'" />
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="badge">${course.category}</div>
      <h1>${course.title}</h1>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
        <span class="star-row">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
        <span style="font-size:12px;color:rgba(255,255,255,0.85)">${course.rating.toFixed(1)} (12,990)</span>
      </div>
    </div>
  </div>

  <div class="body">
    <div class="card">
      <div class="section-label">Course Stats</div>
      <div class="stats">
        <div class="stat"><div class="stat-val">${course.duration}</div><div class="stat-label">Duration</div></div>
        <div class="divider-v"></div>
        <div class="stat"><div class="stat-val">12</div><div class="stat-label">Modules</div></div>
        <div class="divider-v"></div>
        <div class="stat"><div class="stat-val">420</div><div class="stat-label">Members</div></div>
        <div class="divider-v"></div>
        <div class="stat"><div class="stat-val">$${course.price}</div><div class="stat-label">Price</div></div>
      </div>
      <div style="margin-top:14px">
        <div class="progress-row"><span>Your Progress</span><span id="pct-label">35%</span></div>
        <div class="bar"><div class="fill" id="prog"></div></div>
      </div>
    </div>

    <div class="card">
      <div class="section-label">Mentor</div>
      <div class="instructor">
        <div class="avatar"><img src="${course.instructor.avatar}" onerror="this.style.display='none'"/></div>
        <div>
          <div class="instr-name">${course.instructor.name}</div>
          <div class="instr-role">${course.instructor.expertise} Expert</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-label">Modules</div>
      ${['Introduction & Setup','Core Fundamentals','Advanced Concepts','Real-World Projects','Final Assessment']
        .map((m,i) => `
        <div class="module" onclick="sendMsg('open_module_${i}')">
          <div class="mod-num ${i===2?'active':''}">${i+1}</div>
          <div style="flex:1">
            <div class="mod-title">${m}</div>
            <div class="mod-meta">${20+i*10} min &middot; ${3+i} lessons</div>
          </div>
          <span style="color:${i<2?'#22c55e':i===2?'#3D5AFE':'#9CA3AF'};font-size:15px">${i<2?'&#10003;':i===2?'&#9654;':'&#128274;'}</span>
        </div>`).join('')}
    </div>

    <button class="btn btn-ghost" onclick="sendMsg('go_back')">&larr; Back to App</button>
  </div>

  <script>
    function sendMsg(action){window.ReactNativeWebView.postMessage(JSON.stringify({action:action,courseId:'${course.id}'}));}
    window.addEventListener('load',function(){setTimeout(function(){var p=document.getElementById('prog');if(p)p.style.width='35%';},400);});
  </script>
</body>
</html>`;
}

export default function WebViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const courses = useCourseStore((s) => s.courses);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const course = courses.find((c) => c.id === id);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as { action: string };
      if (data.action === 'go_back' || data.action === 'continue_learning') router.back();
    } catch {}
  };

  if (!course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.textSecondary }}>Course not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 38, height: 38, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: theme.border }}
        >
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.textPrimary, fontWeight: '600', fontSize: 14 }} numberOfLines={1}>{course.title}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Course Content</Text>
        </View>
        {loading && <ActivityIndicator size="small" color={theme.primary} />}
      </View>

      {hasError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Ionicons name="wifi-outline" size={52} color={theme.textMuted} />
          <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginTop: 16, marginBottom: 8 }}>
            Content failed to load
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
            Check your connection and try again
          </Text>
          <TouchableOpacity
            onPress={() => { setHasError(false); webViewRef.current?.reload(); }}
            style={{ backgroundColor: theme.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: buildCourseHTML(course, isDark), baseUrl: 'about:blank' }}
          onLoadEnd={() => setLoading(false)}
          onError={() => { setLoading(false); setHasError(true); }}
          onMessage={handleMessage}
          injectedJavaScript={`(function(){document.documentElement.style.webkitUserSelect='none';true;})();`}
          style={{ flex: 1, backgroundColor: theme.background }}
          showsVerticalScrollIndicator={false}
          allowsBackForwardNavigationGestures
          originWhitelist={['*']}
        />
      )}
    </SafeAreaView>
  );
}
