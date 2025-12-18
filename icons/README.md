# App Icons

This directory contains icon assets for PWA (Progressive Web App) and TWA (Trusted Web Activity) packaging.

## Files

### `app-icon-512.png` (512×512)
- **Purpose**: Play Store listing icon
- **Usage**: Referenced in `manifest.webmanifest` for PWA installation
- **Format**: PNG, 512×512 pixels
- **Type**: Standard app icon

### `adaptive-foreground-432.png` (432×432)
- **Purpose**: Android adaptive icon foreground layer
- **Usage**: Used during Bubblewrap packaging for TWA
- **Format**: Transparent PNG, 432×432 pixels
- **Note**: Not referenced in manifest (used by packaging tools)

### `adaptive-background-432.png` (432×432)
- **Purpose**: Android adaptive icon background layer
- **Usage**: Used during Bubblewrap packaging for TWA
- **Format**: PNG, 432×432 pixels
- **Note**: Not referenced in manifest (used by packaging tools)

## Notes

- The 512×512 icon is referenced in the web app manifest for PWA installation
- The 432×432 adaptive icon layers are included for Android packaging but are not directly referenced by the manifest
- These files should not be modified or removed as they are required for app store submission and packaging
