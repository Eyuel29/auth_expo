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

### 2. Run the App

Start your app with:

```bash
bun start
```

### 3. Environment Variables

Set up your environment file (`.env`):

```
EXPO_PUBLIC_SERVER_URL=https://auth-backend-tbhw.onrender.com
```