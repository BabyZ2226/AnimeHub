import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { ThemeToggle } from './components/theme/ThemeToggle';
import { RandomAnimeButton } from './components/ui/RandomAnimeButton';
import { Sidebar } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Lists } from './pages/Lists';
import { Seasonal } from './pages/Seasonal';
import { News } from './pages/News';
import { Entertainment } from './pages/Entertainment';
import { AnimeDetails } from './pages/AnimeDetails';
import { Watch } from './pages/Watch';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Sidebar onCollapsedChange={setSidebarCollapsed} />
            <main className={`transition-all duration-300 ${
              sidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/seasonal" element={<Seasonal />} />
                <Route path="/news" element={<News />} />
                <Route path="/entertainment" element={<Entertainment />} />
                <Route path="/anime/:id" element={<AnimeDetails />} />
                <Route path="/watch/:id/:episode" element={<Watch />} />
              </Routes>
            </main>
            <ThemeToggle />
            <RandomAnimeButton />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;