## Setup Guide

### 1. Install Bun

```bash
curl -fsSL https://bun.com/install | bash
```

Verify installation:

```bash
bun --version
# Example output: 1.x.y

bun --revision
# Example output: 1.x.y+b7982ac13189
```

---

### 2. Install EAS CLI

```bash
bun add eas-cli@latest --global
```

Verify installation:

```bash
eas -v
```

Login to your Expo account:

```bash
eas login
```

Initialize your project:

```bash
eas init
```

Build your app:

```bash
eas build
```

---

### 3. Run the App

Start your app with:

```bash
bun start
```

Follow the prompts:

* Press **`a`** to open Android emulator/device
* Press **`Shift + a`** to open in web browser
* Press **`w`** to open in web

---

### 4. Environment Variables

Set up your environment file (`.env`):

```
EXPO_PUBLIC_SERVER_URL=https://your-backend-url.com
```