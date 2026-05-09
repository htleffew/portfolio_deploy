/**
 * Houdini Paint Worklet: Text Shimmer
 * Renders a chromatic highlight sweep across text elements.
 */
class TextShimmer {
    static get inputProperties() {
        return ['--shimmer-pos', '--shimmer-color', '--text-color'];
    }

    paint(ctx, size, properties) {
        // Read custom properties or set defaults
        let pos = parseFloat(properties.get('--shimmer-pos').toString()) || -100;
        const shimmerColor = properties.get('--shimmer-color').toString().trim() || 'rgba(255, 255, 255, 0.9)';
        const textColor = properties.get('--text-color').toString().trim() || '#A1A1A6'; // var(--tungsten)

        const { width, height } = size;
        
        // Calculate the center of the shimmer based on the pos percentage (-100 to 200)
        const xPos = (pos / 100) * width;
        const spread = width * 0.3; // How wide the shimmer band is

        // Create linear gradient for the shimmer effect
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        
        // We use absolute coordinates for stops to create a sliding window
        // But since createLinearGradient uses absolute coordinates for the line, 
        // we can just map the stops normally if we set the gradient bounds correctly.
        // Actually, it's easier to set color stops on a static gradient and move the stops.
        
        // Math to clamp stops between 0 and 1
        const stop1 = Math.max(0, Math.min(1, (xPos - spread) / width));
        const stop2 = Math.max(0, Math.min(1, xPos / width));
        const stop3 = Math.max(0, Math.min(1, (xPos + spread) / width));

        gradient.addColorStop(0, textColor);
        if (stop1 > 0) gradient.addColorStop(stop1, textColor);
        gradient.addColorStop(stop2, shimmerColor);
        if (stop3 < 1) gradient.addColorStop(stop3, textColor);
        gradient.addColorStop(1, textColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
}

registerPaint('textShimmer', TextShimmer);
