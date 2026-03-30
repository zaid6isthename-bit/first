import Layout from './components/Layout';
import CalendarView from './components/CalendarView';
import FocusView from './components/FocusView';
import DayView from './components/DayView';
import { useStore } from './store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { viewMode } = useStore();

  const renderView = () => {
    switch (viewMode) {
      case 'month':
        return <CalendarView />;
      case 'day':
        return <DayView />;
      case 'focus':
        return <FocusView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
