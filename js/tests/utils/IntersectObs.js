/* istanbul ignore file */

// IntersectionObserver isn't available in test environment. Dont EVER use this anywhere EXCEPT the test env
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;
global.IntersectionObserver = mockIntersectionObserver;
IntersectionObserver = mockIntersectionObserver;
