import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Platform, Text, ViewStyle } from 'react-native';
import OriginalPDFReader from 'rn-pdf-reader-js';

function PDFReader(props) {
    const { source, fallbackMessage, style } = props;

    let pdfData;
    if (source && source.base64) {
        pdfData = `data:application/pdf;base64,${source.base64}`;
    } else if (source && source.uri) {
        pdfData = source.uri;
    }

    useEffect(() => {
        const originalDebug = console.debug;
        console.debug = () => {};

        // Restore original console.debug function when the component is unmounted
        return () => {
            console.debug = originalDebug;
        };
    }, []);

    return Platform.OS === 'web' ? (
        <object
            {...props}
            type="application/pdf"
            data={pdfData}
            style={style}
        >
            <Text>{fallbackMessage || "Could not load PDF. Make sure the source is correct and the browser is not on device mode."}</Text>
        </object>
    ) : (
        <OriginalPDFReader
            {...props}
            style={style}
        />
    );
}

PDFReader.propTypes = {
    source: PropTypes.oneOfType([
        PropTypes.shape({
            uri: PropTypes.string
        }),
        PropTypes.shape({
            base64: PropTypes.string
        })
    ]).isRequired,
    fallbackMessage: PropTypes.string,
    style: PropTypes.object
};

export default PDFReader;
