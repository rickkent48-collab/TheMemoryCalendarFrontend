# TWA (Trusted Web Activity) Build Instructions

This guide explains how to build a signed Android App Bundle (.aab) for The Memory Calendar TWA and deploy it to the Google Play Store.

## 📱 Running the Workflow from Your Phone

You can trigger the build workflow directly from your phone using the GitHub mobile app or web browser:

### Option 1: GitHub Mobile App (Recommended)
1. Install the **GitHub** app from the Play Store or App Store
2. Sign in to your GitHub account
3. Navigate to the `rickkent48-collab/TheMemoryCalendarFrontend` repository
4. Tap on **Actions** tab
5. Select **Build Signed TWA App Bundle** workflow
6. Tap **Run workflow** button
7. Select the branch (usually `main` or the current branch)
8. Tap **Run workflow** to start the build

### Option 2: Mobile Web Browser
1. Open your mobile browser (Chrome, Safari, etc.)
2. Go to: `https://github.com/rickkent48-collab/TheMemoryCalendarFrontend/actions`
3. Tap **Build Signed TWA App Bundle** workflow
4. Tap **Run workflow** dropdown
5. Select the branch and tap **Run workflow**

## ⏱️ Wait for Build to Complete

The build process takes approximately 5-10 minutes. You can monitor progress:
- In the GitHub app: Go to Actions tab and tap on the running workflow
- In browser: Refresh the Actions page to see the status

You'll receive a notification when the build completes (if notifications are enabled).

## 📥 Downloading the Artifacts

Once the workflow completes successfully:

### From Phone
1. Open the completed workflow run
2. Scroll down to **Artifacts** section
3. Download the following files:
   - `signed-app-bundle` - Contains the .aab file
   - `upload-keystore` - Contains the keystore (.jks) file
   - `keystore-credentials` - Contains passwords and fingerprint
4. Files will download to your Downloads folder
5. **IMPORTANT**: Back up the keystore and credentials file securely! You'll need them for all future app updates

### From Desktop
1. Navigate to the workflow run
2. Scroll to Artifacts section
3. Click to download each artifact
4. Extract the ZIP files to access the contents

## 🎮 Google Play Console Setup

### Step 1: Create App in Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in the details:
   - **App name**: The Memory Calendar
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept the declarations and create the app

### Step 2: Upload to Internal Testing
1. In Play Console, go to **Testing** > **Internal testing**
2. Click **Create new release**
3. Upload the **TheMemoryCalendar-release-signed.aab** file
4. Add release notes (e.g., "Initial internal test build")
5. Click **Save** and then **Review release**
6. Click **Start rollout to Internal testing**

### Step 3: Enable Play App Signing
1. During the upload process, Play Console will prompt you to enable **Play App Signing**
2. Click **Continue** to opt-in to Play App Signing
3. Google will manage your app signing key
4. Your upload key (from the workflow) will be used to verify uploads

### Step 4: Get App Signing Key Fingerprint
After enabling Play App Signing:
1. Go to **Setup** > **App signing** in Play Console
2. Under **App signing key certificate**, find the **SHA-256 certificate fingerprint**
3. Copy this fingerprint (it looks like: `AA:BB:CC:DD:...`)
4. **IMPORTANT**: This is different from the upload key fingerprint shown in the workflow!

## 🔗 Update Asset Links

The Asset Links file tells Android that your website and app are linked.

### What is assetlinks.json?
This file must be hosted at:
```
https://rickkent48-collab.github.io/.well-known/assetlinks.json
```

### Update the File
1. Go to your website repository: `rickkent48-collab/rickkent48-collab.github.io`
2. Navigate to `.well-known/assetlinks.json`
3. Update the `sha256_cert_fingerprints` array with the **App Signing key SHA-256** from Play Console (Step 4 above)
4. The file should look like:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.github.thememorycalendar",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```
5. Replace the fingerprint with your actual App Signing key SHA-256 (with colons)
6. Commit and push the changes
7. Wait a few minutes for GitHub Pages to deploy the update

### Verify Asset Links
You can verify the asset links are working:
1. Visit: `https://rickkent48-collab.github.io/.well-known/assetlinks.json`
2. Ensure it returns the JSON with your fingerprint
3. Use Google's tester: https://developers.google.com/digital-asset-links/tools/generator

## 📲 Installing and Testing

### Add Testers to Internal Testing
1. In Play Console, go to **Testing** > **Internal testing**
2. Go to **Testers** tab
3. Create an email list and add tester email addresses
4. Save the changes

### Install the App
1. Testers will receive an email invitation
2. Or share the **internal testing link** from Play Console
3. Open the link on an Android device
4. Accept the invite and install the app
5. The app will download from Play Store

### Verify TWA Functionality
After installing:
- ✅ App should open fullscreen (no URL bar)
- ✅ App icon should appear in launcher
- ✅ App should feel like a native app
- ✅ No browser UI elements should be visible

If you see a URL bar:
- Asset links may not be set up correctly
- Verify the assetlinks.json file is accessible
- Ensure you used the App Signing key (not upload key)
- Wait up to 48 hours for verification to propagate

## 🔄 Updating the App

For future updates:

1. **Run the workflow again** (it will use a different keystore)
   - OR better: **Reuse the original keystore** for updates

2. **To reuse the original keystore:**
   - You'll need to modify the workflow to use your saved keystore
   - Store the keystore securely (e.g., GitHub Secrets as base64)
   - Update the workflow to decode and use your keystore

3. **Upload new .aab** to Play Console
   - Go to Internal testing > Create new release
   - Upload the new signed .aab
   - Must be signed with the same keystore to be accepted

## ⚠️ Important Notes

### Security
- **Never commit the keystore to the repository**
- **Keep the keystore-credentials.txt file secure**
- **Back up the keystore** - if you lose it, you cannot update your app!
- Consider storing keystore in a secure password manager

### Upload Key vs App Signing Key
- **Upload Key** (from workflow): Used to verify your identity when uploading
- **App Signing Key** (from Play Console): Used by Google to sign the actual APK
- Asset links must use the **App Signing Key**, not the Upload Key

### First-Time Setup Only
The workflow generates a new keystore each time. For production use:
- Save the first keystore and credentials
- Modify workflow to use the saved keystore for consistency
- This ensures all updates can be published to the same app listing

## 📚 Additional Resources

- [Trusted Web Activities Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

## 🆘 Troubleshooting

### Build fails
- Check the workflow logs in the Actions tab
- Ensure all required files are in the repository
- Verify icon files are present in `icons/` directory

### App opens with URL bar (not fullscreen)
- Check assetlinks.json is accessible at the correct URL
- Verify you used the App Signing key SHA-256, not upload key
- Allow up to 48 hours for asset links to propagate
- Uninstall and reinstall the app

### Cannot upload to Play Console
- Ensure you're using the same keystore for updates
- Check version code is higher than previous version
- Verify the package name matches (com.github.thememorycalendar)

### Workflow not visible
- Check you're on the correct repository
- Ensure the workflow file is in `.github/workflows/` directory
- Verify you have permission to run workflows

## 📞 Support

If you encounter issues:
1. Check the workflow logs for error messages
2. Review this documentation carefully
3. Consult the official Trusted Web Activity documentation
4. Check GitHub Actions logs for detailed error information
