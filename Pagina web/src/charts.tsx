/**
 * Graficos y Laboratorio de Datos.
 *
 * Viven en su propio modulo para que Recharts y PapaParse (las dependencias
 * mas pesadas del proyecto) no entren en el paquete inicial: se descargan
 * solo cuando el visitante llega a la seccion de analitica o abre el Data Lab.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import {
  Activity,
  BarChart3,
  Database,
  FileJson,
  TrendingUp} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis} from 'recharts';

import { translations } from './translations';

// --- Analytics Components ---

// Los graficos usaban colores fijos oscuros; esto los adapta al tema activo.
const useChartTheme = () => {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return {
    grid: dark ? '#333' : '#d4d4d8',
    axis: dark ? '#666' : '#71717a',
    tooltipBg: dark ? '#121212' : '#ffffff',
    tooltipBorder: dark ? '1px solid #333' : '1px solid #e4e4e7',
    tooltipText: dark ? '#fff' : '#18181b',
  };
};

const PARETO_COLORS = ['#D97706', '#F59E0B', '#F59E0B', '#14B8A6', '#3B82F6'];

export const ParetoChartComponent = () => {
  const ct = useChartTheme();
  const data = [
    { name: 'Causa A', value: 450, cumulative: 45 },
    { name: 'Causa B', value: 300, cumulative: 75 },
    { name: 'Causa C', value: 150, cumulative: 90 },
    { name: 'Causa D', value: 60, cumulative: 96 },
    { name: 'Causa E', value: 40, cumulative: 100 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
          <XAxis dataKey="name" stroke={ct.axis} fontSize={12} />
          <YAxis yAxisId="left" stroke={ct.axis} fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: ct.tooltipBg, border: ct.tooltipBorder, borderRadius: '8px' }}
            itemStyle={{ color: ct.tooltipText }}
          />
          <Bar yAxisId="left" dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={PARETO_COLORS[i % PARETO_COLORS.length]} />
            ))}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#fff', stroke: '#F59E0B', strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const IshikawaDiagram = () => {
  const top = [
    { label: 'Mano de Obra', x: 150 },
    { label: 'Maquinaria', x: 280 },
    { label: 'Métodos', x: 410 },
  ];
  const bottom = [
    { label: 'Materiales', x: 150 },
    { label: 'Medición', x: 280 },
    { label: 'Medio Ambiente', x: 410 },
  ];
  const SPINE_Y = 150;

  return (
    <div className="w-full h-[300px]">
      <svg viewBox="0 0 700 300" className="w-full h-full" fontFamily="inherit">
        {/* Spine */}
        <line x1="30" y1={SPINE_Y} x2="555" y2={SPINE_Y} stroke="#D97706" strokeOpacity="0.5" strokeWidth="2" />
        {/* Arrowhead */}
        <polygon points="555,135 595,150 555,165" fill="#D97706" />
        <text x="608" y={SPINE_Y + 6} fill="#D97706" fontSize="18" fontWeight="900" letterSpacing="1">
          PROBLEMA
        </text>

        {top.map((cat, i) => (
          <g key={`t-${i}`}>
            <line x1={cat.x - 90} y1="55" x2={cat.x} y2={SPINE_Y} stroke="#D97706" strokeOpacity="0.55" strokeWidth="2" />
            <circle cx={cat.x} cy={SPINE_Y} r="3.5" fill="#D97706" />
            <text x={cat.x - 95} y="45" textAnchor="start" fill="#9CA3AF" fontSize="12" fontWeight="700" letterSpacing="0.5">
              {cat.label.toUpperCase()}
            </text>
          </g>
        ))}

        {bottom.map((cat, i) => (
          <g key={`b-${i}`}>
            <line x1={cat.x - 90} y1="245" x2={cat.x} y2={SPINE_Y} stroke="#D97706" strokeOpacity="0.55" strokeWidth="2" />
            <circle cx={cat.x} cy={SPINE_Y} r="3.5" fill="#D97706" />
            <text x={cat.x - 95} y="262" textAnchor="start" fill="#9CA3AF" fontSize="12" fontWeight="700" letterSpacing="0.5">
              {cat.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const RadarChartComponent = () => {
  const ct = useChartTheme();
  const data = [
    { subject: 'Calidad', A: 120, B: 110, fullMark: 150 },
    { subject: 'Costo', A: 98, B: 130, fullMark: 150 },
    { subject: 'Entrega', A: 86, B: 130, fullMark: 150 },
    { subject: 'Seguridad', A: 99, B: 100, fullMark: 150 },
    { subject: 'Moral', A: 85, B: 90, fullMark: 150 },
    { subject: 'Eficiencia', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={ct.grid} />
          <PolarAngleAxis dataKey="subject" stroke={ct.axis} fontSize={10} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} stroke={ct.grid} fontSize={10} />
          <Radar name="Actual" dataKey="A" stroke="#D97706" fill="#D97706" fillOpacity={0.5} />
          <Radar name="Target" dataKey="B" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.25} />
          <Tooltip 
            contentStyle={{ backgroundColor: ct.tooltipBg, border: ct.tooltipBorder, borderRadius: '8px' }}
            itemStyle={{ color: ct.tooltipText }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendChartComponent = () => {
  const ct = useChartTheme();
  const data = [
    { name: 'Sem 1', value: 400, pred: 400 },
    { name: 'Sem 2', value: 300, pred: 350 },
    { name: 'Sem 3', value: 500, pred: 450 },
    { name: 'Sem 4', value: 450, pred: 500 },
    { name: 'Sem 5', value: 600, pred: 550 },
    { name: 'Sem 6', value: 550, pred: 650 },
    { name: 'Sem 7', value: null, pred: 700 },
    { name: 'Sem 8', value: null, pred: 750 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
          <XAxis dataKey="name" stroke={ct.axis} fontSize={12} />
          <YAxis stroke={ct.axis} fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: ct.tooltipBg, border: ct.tooltipBorder, borderRadius: '8px' }}
            itemStyle={{ color: ct.tooltipText }}
          />
          <Area type="monotone" dataKey="value" stroke="#D97706" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
          <Area type="monotone" dataKey="pred" stroke="#F59E0B" strokeDasharray="5 5" fill="transparent" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LiveDashboard = ({ lang }: { lang: 'es' | 'en' }) => {
  const t = translations[lang].analytics.dashboard;
  const pieData = [
    { name: 'Producción', value: 85, fill: '#14B8A6' },
    { name: 'Merma', value: 15, fill: '#D97706' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass p-6 rounded-3xl text-center">
        <Activity className="mx-auto text-brand mb-4" size={32} />
        <div className="text-3xl font-black mb-1">94.2%</div>
        <div className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{t.efficiency}</div>
      </div>
      <div className="glass p-6 rounded-3xl text-center">
        <div className="h-24 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={30} outerRadius={40} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-3xl font-black mb-1">98.5%</div>
        <div className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{t.quality}</div>
      </div>
      <div className="glass p-6 rounded-3xl text-center">
        <div className="text-3xl font-black mb-1 text-brand">12m</div>
        <div className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{t.downtime}</div>
        <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '15%' }}
            className="h-full bg-brand"
          />
        </div>
      </div>
    </div>
  );
};

// --- Data Analyzer Component ---

export const DataAnalyzer = ({ lang }: { lang: 'es' | 'en' }) => {
  const ct = useChartTheme();
  const t = translations[lang].analyzer;
  const [data, setData] = useState<any[]>([]);
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [regressionData, setRegressionData] = useState<any[]>([]);
  const [regressionLine, setRegressionLine] = useState<{ m: number, b: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          // Case-insensitive header check
          const raw = results.data.map((row: any) => {
            const normalizedRow: any = {};
            Object.keys(row).forEach(key => {
              const lowerKey = key.toLowerCase();
              if (lowerKey === 'causa' || lowerKey === 'cause') normalizedRow.Causa = row[key];
              if (lowerKey === 'valor' || lowerKey === 'value') normalizedRow.Valor = row[key];
            });
            return normalizedRow;
          }).filter((row: any) => row.Causa !== undefined && row.Valor !== undefined);

          if (raw.length === 0) throw new Error("No data");

          // Process Pareto
          const sorted = [...raw].sort((a, b) => b.Valor - a.Valor);
          const total = sorted.reduce((acc, curr) => acc + curr.Valor, 0);
          let runningTotal = 0;
          const pareto = sorted.map(item => {
            runningTotal += item.Valor;
            return {
              name: item.Causa,
              value: item.Valor,
              cumulative: Math.round((runningTotal / total) * 100)
            };
          });

          // Process Regression (assuming X is index, Y is Valor)
          const regression = raw.map((item, i) => ({ x: i, y: item.Valor, name: item.Causa }));
          const n = regression.length;
          const sumX = regression.reduce((acc, curr) => acc + curr.x, 0);
          const sumY = regression.reduce((acc, curr) => acc + curr.y, 0);
          const sumXY = regression.reduce((acc, curr) => acc + curr.x * curr.y, 0);
          const sumXX = regression.reduce((acc, curr) => acc + curr.x * curr.x, 0);

          const denominator = (n * sumXX - sumX * sumX);
          const m = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
          const b = (sumY - m * sumX) / n;

          setData(raw);
          setParetoData(pareto);
          setRegressionData(regression);
          setRegressionLine({ m, b });
          setError(null);
        } catch (err) {
          setError(t.error);
        }
      }
    });
  };

  const stats = data.length > 0 ? {
    count: data.length,
    sum: data.reduce((acc, curr) => acc + curr.Valor, 0),
    avg: data.reduce((acc, curr) => acc + curr.Valor, 0) / data.length,
    max: Math.max(...data.map(d => d.Valor)),
    min: Math.min(...data.map(d => d.Valor))
  } : null;

  const downloadTemplate = () => {
    const csvContent = "Causa,Valor\nCausa A,450\nCausa B,300\nCausa C,150\nCausa D,60\nCausa E,40";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_base.csv';
    a.click();
  };

  return (
    <section id="analyzer" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <label className="px-8 py-3 bg-brand rounded-xl font-bold cursor-pointer hover:scale-105 transition-transform flex items-center gap-2">
            <Database size={20} />
            {t.upload}
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button 
            onClick={downloadTemplate}
            className="px-8 py-3 glass rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <FileJson size={20} />
            {t.downloadTemplate}
          </button>
        </div>

        {error && (
          <div className="glass p-6 rounded-2xl border-brand/50 text-brand text-center mb-8">
            {error}
          </div>
        )}

        {data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: lang === 'es' ? 'Muestra' : 'Sample', value: stats?.count },
                { label: lang === 'es' ? 'Total' : 'Total', value: stats?.sum.toLocaleString() },
                { label: lang === 'es' ? 'Promedio' : 'Average', value: stats?.avg.toFixed(2) },
                { label: lang === 'es' ? 'Máximo' : 'Maximum', value: stats?.max.toLocaleString() },
                { label: lang === 'es' ? 'Mínimo' : 'Minimum', value: stats?.min.toLocaleString() },
              ].map((s, i) => (
                <div key={i} className="glass p-4 rounded-2xl text-center">
                  <div className="text-brand font-black text-xl">{s.value}</div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-[40px] border-gray-200 dark:border-white/5"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-brand" size={20} />
                {t.pareto}
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={paretoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={ct.axis} fontSize={12} />
                    <YAxis yAxisId="left" stroke={ct.axis} fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#D97706" fontSize={12} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: ct.tooltipBg, border: ct.tooltipBorder, borderRadius: '8px' }}
                      itemStyle={{ color: ct.tooltipText }}
                    />
                    <Bar yAxisId="left" dataKey="value" fill="#D97706" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={ct.axis} strokeWidth={3} dot={{ fill: '#D97706', stroke: '#fff', strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[40px] border-gray-200 dark:border-white/5"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-brand" size={20} />
                {t.regression}
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} />
                    <XAxis type="number" dataKey="x" name="Index" stroke={ct.axis} />
                    <YAxis type="number" dataKey="y" name="Valor" stroke={ct.axis} />
                    <ZAxis range={[60, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Data" data={regressionData} fill="#D97706" />
                    {regressionLine && (
                      <Line 
                        type="monotone" 
                        data={[
                          { x: 0, y: regressionLine.b },
                          { x: regressionData.length - 1, y: regressionLine.m * (regressionData.length - 1) + regressionLine.b }
                        ]} 
                        dataKey="y" 
                        stroke={ct.axis} 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={false}
                      />
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 glass rounded-2xl text-xs font-mono text-gray-600 dark:text-gray-400">
                y = {regressionLine?.m.toFixed(4)}x + {regressionLine?.b.toFixed(4)}
              </div>
            </motion.div>
          </div>
          </>
        ) : (
          <label className="block rounded-[40px] border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-brand/50 bg-white dark:bg-white/[0.02] cursor-pointer transition-colors group overflow-hidden">
            <div className="p-10 md:p-14 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 group-hover:scale-105 transition-all mb-6">
                <Database className="text-brand" size={34} />
              </div>
              <p className="text-lg font-bold mb-2">
                {lang === 'es' ? 'Arrastra tu CSV o haz clic aquí' : 'Drop your CSV or click here'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                {lang === 'es'
                  ? 'Al cargarlo se calculan automáticamente el diagrama de Pareto, la regresión lineal y las estadísticas descriptivas.'
                  : 'Once loaded, the Pareto chart, linear regression and descriptive statistics are computed automatically.'}
              </p>

              {/* Formato esperado, para que se entienda sin tener que probar */}
              <div className="max-w-xs mx-auto text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  {lang === 'es' ? 'Formato esperado' : 'Expected format'}
                </p>
                <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden font-mono text-xs">
                  <div className="grid grid-cols-2 bg-gray-100 dark:bg-white/5 font-bold text-gray-700 dark:text-gray-300">
                    <span className="px-3 py-2 border-r border-gray-200 dark:border-white/10">Causa</span>
                    <span className="px-3 py-2">Valor</span>
                  </div>
                  {[['Causa A', '450'], ['Causa B', '300'], ['Causa C', '150']].map(([a, b]) => (
                    <div key={a} className="grid grid-cols-2 border-t border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400">
                      <span className="px-3 py-1.5 border-r border-gray-200 dark:border-white/10">{a}</span>
                      <span className="px-3 py-1.5">{b}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-3">
                  {lang === 'es'
                    ? '¿No tienes un archivo? Descarga la plantilla base de arriba.'
                    : 'No file yet? Download the base template above.'}
                </p>
              </div>
            </div>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        )}
      </div>
    </section>
  );
};
