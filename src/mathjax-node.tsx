import React, { useContext, useEffect, useRef } from 'react';
import { MathJaxContext } from './mathjax-context';

interface MathJaxNodeProps {
    formula: string;
    inline?: boolean;
}

function MathJaxNode({ formula, inline = false } : MathJaxNodeProps){
    const { MathJax } = useContext(MathJaxContext);
    const nodeRef = useRef(null);

    useEffect(() => {
        if (MathJax && nodeRef.current) {
            MathJax.Hub.Queue(() => {
                const jax = MathJax.Hub.getAllJax(nodeRef.current);
                if (jax && jax.length > 0) {
                    jax[0].Text(formula);
                } else {
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, nodeRef.current]);
                }
            });
        }
    }, [formula, MathJax]);

    return (
        <span ref={nodeRef}>
            {inline ? `\\(${formula}\\)` : `\\[${formula}\\]`}
        </span>
    );
};

export default MathJaxNode;
