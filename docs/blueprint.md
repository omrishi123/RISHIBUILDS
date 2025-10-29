# **App Name**: App Central

## Core Features:

- App Display: Display available applications fetched from Firestore in a user-friendly grid format on the homepage. Displays: App Name, Description, Download Button.
- App Downloading: Enable users to download the uploaded files directly from the application cards using download URLs.
- Authentication: Implement Firebase Authentication to secure the admin panel with email/password login and signup.
- Secure Uploading: Allow the administrator to upload new application files and details securely through a dedicated admin panel, complete with progress updates. Files are uploaded to Firebase Storage and metadata stored in Firestore.
- App Management: Provide an interface in the admin panel to manage (list, delete) uploaded apps and associated files using Firestore and Firebase Storage.
- Real-time Updates: Use Firestore's onSnapshot listeners to provide real-time updates of application listings on the public homepage and the admin panel.

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) for a professional and trustworthy feel.
- Background color: Light Gray (#F0F0F0) for a clean and modern look.
- Accent color: Teal (#009688) for interactive elements and highlights, providing a sense of action.
- Body and headline font: 'Inter', a sans-serif font known for its readability and modern aesthetic.
- Code font: 'Source Code Pro' for displaying code snippets clearly.
- Use simple, consistent icons from a library like FontAwesome or Material Icons to represent app categories and actions.
- Use a grid-based layout with Tailwind CSS for responsive design. App cards on the homepage and forms in the admin panel should be well-spaced and aligned.
- Incorporate subtle transitions and animations, such as a loading spinner when fetching apps or a fade-in effect for new apps added to the list.