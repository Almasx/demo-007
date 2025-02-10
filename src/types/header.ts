export interface ChatHeader {
  // Unique identifier for the header
  id: string;
  
  // Title of the header/section
  title: string;
  
  // Reference to scroll to (could be message ID or element ID)
  anchor: string;
  
  // Level of the header (1 for main sections, 2 for subsections, etc.)
  level: number;
  
  // Optional children headers for nested structure
  children?: ChatHeader[];
  
  // Message index or timestamp for ordering
  position: number;
}

