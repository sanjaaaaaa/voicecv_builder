import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { CvProvider } from '../context/CvContext';
import { VoiceProvider } from '../context/VoiceContext';
import { AuthProvider } from '../context/AuthContext'; // AuthProvider is removed
import Layout from '../components/layout/Layout';
import { AnimatePresence, motion } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider> {/* AuthProvider removed */}
      <ThemeProvider>
        <CvProvider>
          <VoiceProvider>
            <Layout>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={router.route}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="h-full w-full"
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
            </Layout>
          </VoiceProvider>
        </CvProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;