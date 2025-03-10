# Kanban Task Management Web App

A responsive web application for managing tasks using the Kanban methodology. This app allows users to create and manage boards, columns, and tasks with an intuitive drag-and-drop interface.

## Features

- Create, read, update, and delete boards
- Create, read, update, and delete tasks and subtasks
- Mark subtasks as complete or incomplete
- Drag and drop tasks between columns
- Toggle between light and dark mode
- Responsive design for desktop, tablet, and mobile
- Data persistence using local storage

## Tech Stack

- **Framework**: Next.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Drag and Drop**: react-beautiful-dnd

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kanban-task-manager.git
   cd kanban-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router components
- `/src/components`: React components
- `/src/hooks`: Custom React hooks
- `/src/store`: Zustand store for state management
- `/src/types`: TypeScript type definitions
- `/src/styles`: Global styles
- `/public/assets`: Static assets like images and icons

## Usage

1. **Create a Board**: Click on "+ Create New Board" in the sidebar
2. **Add Columns**: Add columns when creating a board or by editing an existing board
3. **Add Tasks**: Click on "+ Add New Task" to add tasks to a column
4. **Move Tasks**: Drag and drop tasks between columns
5. **Edit/Delete**: Use the dropdown menu (three dots) to edit or delete boards and tasks
6. **Toggle Theme**: Use the theme toggle in the sidebar to switch between light and dark mode

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by [Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB)
- Icons from the assets folder 