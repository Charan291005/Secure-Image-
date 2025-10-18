import React from 'react';
import type { FileType } from '../../utils/fileUtils';

// Generic Icon wrapper for two-tone icons
const TwoToneIcon: React.FC<{ paths: { d: string, fill: string, opacity?: number }[], className?: string }> = ({ paths, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    {paths.map((p, i) => <path key={i} fillRule="evenodd" clipRule="evenodd" d={p.d} fill={p.fill} opacity={p.opacity ?? 1} />)}
  </svg>
);

const iconColors = {
  primary: { light: '#0284c7', dark: '#0ea5e9' }, // sky-600, sky-500
  secondary: { light: '#a5f3fc', dark: '#67e8f9' }, // cyan-200, cyan-400
};

export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z", fill: iconColors.primary.dark },
        { d: "M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z", fill: iconColors.primary.light, opacity: 0.4 },
        { d: "M6 12h12v8H6v-8z", fill: iconColors.secondary.dark, opacity: 0.8 },
    ]} {...props} />
);

export const UnlockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3", fill: iconColors.primary.dark },
        { d: "M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3", fill: iconColors.primary.light, opacity: 0.4 },
        { d: "M6 12h12v8H6v-8z", fill: iconColors.secondary.dark, opacity: 0.8 },
    ]} {...props} />
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
      { d: "M12 18a6 6 0 100-12 6 6 0 000 12z", fill: '#f59e0b' },
      { d: "M12 4V2M12 22v-2M5.636 5.636L4.222 4.222M19.778 19.778l-1.414-1.414M4 12H2M22 12h-2M18.364 5.636l-1.414 1.414M5.636 18.364l1.414-1.414", fill: '#facc15' },
    ]} {...props} />
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
      { d: "M12 21a9 9 0 009-9c0-4.09-2.71-7.55-6.44-8.87A8.995 8.995 0 0112 3a9 9 0 010 18z", fill: '#a5b4fc'},
      { d: "M16.5 6A5.5 5.5 0 1011 11.5a5.506 5.506 0 005.5-5.5z", fill: '#818cf8', opacity: 0.7 }
    ]} {...props} />
);

export const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M19.49 11.23C19.82 10.29 20 9.29 20 8.25 20 5.35 17.65 3 14.75 3 12.63 3 10.78 4.23 9.94 6.09A5.485 5.485 0 004.5 6C2.02 6 0 8.02 0 10.5S2.02 15 4.5 15h11.25c2.62 0 4.75-2.13 4.75-4.75 0-1.8-1.02-3.35-2.51-4.02z", fill: iconColors.primary.dark, opacity: 0.5 },
        { d: "M11 14v6h2v-6h3l-4-4-4 4h3z", fill: iconColors.primary.dark }
    ]} {...props} />
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z", fill: '#10b981', opacity: 0.4 },
        { d: "M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8z", fill: '#10b981' },
    ]} {...props} />
);

export const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", fill: '#f87171', opacity: 0.4 },
        { d: "M11 10h2v4h-2zm0 6h2v2h-2z", fill: '#ef4444' },
    ]} {...props} />
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z", fill: iconColors.primary.dark },
        { d: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z", fill: iconColors.secondary.dark, opacity: 0.6 }
    ]} {...props} />
);

export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z", fill: '#10b981', opacity: 0.4 },
        { d: "M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z", fill: '#10b981' }
    ]} {...props} />
);

export const FileGenericIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <TwoToneIcon paths={[
    { d: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z", fill: iconColors.primary.dark, opacity: .4 },
    { d: "M13 9V3.5L18.5 9H13z", fill: iconColors.primary.dark, opacity: .7 },
  ]} {...props}/>
);

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <TwoToneIcon paths={[
    { d: "M16.5 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-9 0L2 13.5V16h2.5l5.5-5.5-2.5-2.5z", fill: iconColors.primary.dark, opacity: .4 },
    { d: "M21 10.5c0-1.02-.38-1.94-1-2.66l-2.66-2.66c-.72-.62-1.64-1-2.66-1s-1.94.38-2.66 1l-2.09 2.09 6.02 6.02C19.92 14.59 21 12.68 21 10.5z", fill: iconColors.primary.dark }
  ]} {...props}/>
);

export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <TwoToneIcon paths={[
    { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z", fill: iconColors.primary.dark, opacity: .4 },
    { d: "M14.5 11l-3 4-2-2.75L7 15h10z", fill: iconColors.primary.dark }
  ]} {...props}/>
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
        { d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z", fill: iconColors.primary.dark },
        { d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z", fill: iconColors.secondary.dark, opacity: 0.6 }
    ]} {...props} />
);

export const ZipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <TwoToneIcon paths={[
      { d: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 16h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z", fill: iconColors.primary.dark, opacity: 0.4 },
      { d: "M13 9V3.5L18.5 9H13z", fill: iconColors.primary.dark, opacity: 0.7 },
      { d: "M10 8v2h2V8h2v2h-2v2h2v2h-2v-2h-2v2h-2v-2h2v-2h-2V8h2z", fill: iconColors.primary.dark }
    ]} {...props}/>
);

const FileTypeIcons: Record<FileType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    image: ImageIcon,
    pdf: FileGenericIcon,
    archive: FileGenericIcon,
    code: FileGenericIcon,
    video: FileGenericIcon,
    audio: FileGenericIcon,
    text: FileGenericIcon,
    document: FileGenericIcon,
    unknown: FileGenericIcon,
};


export const FileIcon: React.FC<{fileType: FileType} & React.SVGProps<SVGSVGElement>> = ({fileType, ...props}) => {
    const IconComponent = FileTypeIcons[fileType] || FileGenericIcon;
    return <IconComponent {...props} />;
};