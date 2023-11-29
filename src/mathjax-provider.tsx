import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { MathJaxContext } from './mathjax-context';
import PropTypes from 'prop-types';
import loadScript from 'load-script';


// declare global {
//     interface Window { MathJax: any; }
// }

// interface MathJaxContextType {
//     MathJax?: typeof window.MathJax;
//     input?: string;
// }

// Define the shape of your props
interface MathJaxProviderProps {
    children: ReactNode;
    didFinishTypeset?: () => void;
    script?: string | false;
    input?: 'ascii' | 'tex';
    delay?: number;
    options?: object;
    loading?: ReactNode;
    noGate?: boolean;
    onError?: (MathJax: typeof window.MathJax, message: any) => void;
    onLoad?: () => void;
}
// Create a Context for MathJax
// export const MathJaxContext = createContext<MathJaxContextType>({});

// export const MathJaxContext = createContext<MathJaxContextType>({});

function MathJaxProvider({
    children,
    script = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML',
    input = 'ascii',
    delay = 0,
    options = {},
    loading = null,
    noGate = false,
    didFinishTypeset,
    onError,
    onLoad
} : MathJaxProviderProps){

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadMathJax = (script : any) => {
            if (!script) {
                handleLoad();
                return;
            }
            loadScript(script, handleLoad);
        };

        const handleLoad = () => {
            console.log("handleLoad")
            if (window.MathJax) {
                console.log("MathJax loaded");
                window.MathJax.Hub.Config(options);
                window.MathJax.Hub.Register.StartupHook('End', () => {
                    window.MathJax.Hub.processSectionDelay = delay;

                    didFinishTypeset && didFinishTypeset();
                    onLoad && onLoad();
                    setLoaded(true);
                });

                window.MathJax.Hub.Register.MessageHook("Math Processing Error", (message : string) => {
                    onError && onError(window.MathJax, message);
                });
            }
        };

        loadMathJax(script);
    }, [script, options, delay, didFinishTypeset, onError, onLoad]);

    if (!loaded && !noGate) {
        return loading ? <div>{loading}</div> : null;
    }

    return (
        <MathJaxContext.Provider value={{ MathJax: window.MathJax, input }}>
            {children}
        </MathJaxContext.Provider>
    );
};

MathJaxProvider.propTypes = {
    children: PropTypes.node.isRequired,
    didFinishTypeset: PropTypes.func,
    script: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]),
    input: PropTypes.oneOf(['ascii', 'tex']),
    delay: PropTypes.number,
    options: PropTypes.object,
    loading: PropTypes.node,
    noGate: PropTypes.bool,
    onError: PropTypes.func,
    onLoad: PropTypes.func
};

MathJaxProvider.defaultProps = {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML',
    input: 'ascii',
    delay: 0,
    options: {},
    loading: null,
    noGate: false
};

export default MathJaxProvider;
