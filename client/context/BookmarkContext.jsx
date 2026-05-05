/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useBookmarks } from "../hooks/useBookmarks";

const BookmarkContext = createContext(null);

/** * Custom hook to access bookmark state and actions.
 *
 * Usage in components:
 * It instantiates useBookmarks() once, so state is shared across all consumers.
 *
 * Usage in main.jsx:
 *   <BookmarkProvider>
 *     <App />
 *   </BookmarkProvider>
 */

export function BookmarkProvider({ children }) {
    const bookmarkState = useBookmarks();
    return (
        <BookmarkContext.Provider value={bookmarkState}>
            {children}
        </BookmarkContext.Provider>
    );
}
/**
 * Consume bookmark state anywhere inside <BookmarkProvider>.
 *
 * Returns: { bookmarks, loading, error, bookmark, unbookmark, isBookmarked }
 *
 * Example:
 *   const { isBookmarked, bookmark, unbookmark } = useBookmarkContext();
 */

export function useBookmarkContext() {
    const ctx = useContext(BookmarkContext);
    if (!ctx) {
        throw new Error("useBookmarkContext must be used within a BookmarkProvider");
    }
    return ctx;
}