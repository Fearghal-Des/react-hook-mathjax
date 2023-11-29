import {createContext} from 'react';


declare global {
    interface Window { MathJax: any; }
}

interface MathJaxContextType {
    MathJax?: typeof window.MathJax;
    input?: string;
}


export const MathJaxContext = createContext<MathJaxContextType>({});