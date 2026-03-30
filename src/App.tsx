import Layout from './components/Layout';
import CalendarView from './components/CalendarView';
import FocusView from './components/FocusView';
import DayView from './components/DayView';
import { useStore } from './store/useStore';


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
      {renderView()}
    </Layout>
  );
}

export default App;
