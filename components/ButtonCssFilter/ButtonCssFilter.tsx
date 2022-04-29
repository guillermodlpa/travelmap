/**
 * Provides the possibility to add CSS filter rules using a distortion
 * This one is used for buttons, with the rule `filter: url(#wavy-button)`
 */
export default function ButtonCssFilter() {
  return (
    <svg display="none">
      <filter id="wavy-button">
        <feTurbulence x="0" y="0" baseFrequency="0.1" numOctaves="5" seed="5"></feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="1" />
      </filter>
    </svg>
  );
}