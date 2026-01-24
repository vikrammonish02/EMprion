
export interface AnalysisResult {
    stage: string;
    confidence: string;
    commentary: string;
    action: string;
    gardner: {
        expansion: string;
        icm: string;
        te: string;
        cell_count?: string;
        cavity_symmetry?: string;
        fragmentation?: string;
    };
    milestones: Record<string, string>;
    anomalies: string[];
    concordance: Record<string, number>;
    analysis_type: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const analyzeEmbryo = async (
    file: File,
    analysisType: 'gardner' | 'morphokinetics' = 'gardner',
    onProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${BASE_URL}/api/predict?analysis_type=${analysisType}`, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                onProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Failed to parse server response'));
                }
            } else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.detail || 'Analysis failed'));
                } catch (e) {
                    reject(new Error(`Server error: ${xhr.statusText}`));
                }
            }
        };

        xhr.onerror = () => reject(new Error('Network error occurred during analysis'));
        xhr.send(formData);
    });
};
