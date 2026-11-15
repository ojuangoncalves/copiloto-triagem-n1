export type PlaybookStep = {
    id: string;
    title: string;
    appliesTo: RecordingLocation[]
    whyItMatters: string;
    evidenceRequired: string;
    vagueExamples: string[]
    nextAction: string;
}

export type Playbook = {
    id: string;
    name: string;
    steps: PlaybookStep[]
}

export type RecordingLocation = "CAMERA_SD" | "NVR_DVR" | "VMS"