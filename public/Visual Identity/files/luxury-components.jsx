/**
 * LUXURY HOTEL - COMPOSANTS REACT + SHADCN
 * Exemples de composants personnalisés
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ==================== 1. CARTE CHAMBRE LUXE ====================
export function RoomCard({ 
  image, 
  title, 
  description, 
  price, 
  amenities = [],
  onBook,
  className 
}) {
  return (
    <Card className={cn(
      "group overflow-hidden border-0 bg-white shadow-lg",
      "transition-all duration-500 hover:shadow-2xl hover:-translate-y-3",
      "before:absolute before:inset-0 before:bg-gradient-to-br",
      "before:from-primary/5 before:to-transparent before:opacity-0",
      "hover:before:opacity-100 before:transition-opacity before:duration-500",
      className
    )}>
      {/* Image avec overlay */}
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge Premium */}
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-primary-foreground px-4 py-2 text-xs font-accent uppercase tracking-wider rounded-full">
            Premium
          </span>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-2xl font-medium text-primary-dark mb-2">
          {title}
        </CardTitle>
        <CardDescription className="font-body text-secondary-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.map((amenity, index) => (
            <span 
              key={index}
              className="text-xs font-accent uppercase tracking-wide text-primary border border-primary/30 px-3 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent my-4" />
        
        {/* Prix */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-heading font-semibold text-primary">
            {price}€
          </span>
          <span className="text-sm text-secondary-600 font-accent uppercase tracking-wide">
            / nuit
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          onClick={onBook}
          className="w-full bg-primary hover:bg-primary-dark text-primary-dark hover:text-primary font-accent uppercase tracking-wide transition-all duration-300"
        >
          Réserver
        </Button>
      </CardFooter>
    </Card>
  );
}

// ==================== 2. HERO SECTION ====================
export function HeroSection({ 
  title, 
  subtitle, 
  backgroundImage,
  cta,
  className 
}) {
  return (
    <section className={cn(
      "relative h-screen flex items-center justify-center overflow-hidden",
      className
    )}>
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        data-parallax="0.5"
      >
        <img 
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Subtitle */}
        <div className="subtitle mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {subtitle}
        </div>
        
        {/* Title */}
        <h1 className="hero-title text-white mb-8 opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {title}
        </h1>
        
        {/* Decorative Line */}
        <div className="w-20 h-px bg-primary mx-auto mb-8 scale-x-0 animate-scale-in" style={{animationDelay: '0.6s'}} />
        
        {/* CTA */}
        <div className="hero-cta opacity-0 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          {cta}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ==================== 3. SERVICES GRID ====================
export function ServicesGrid({ services, className }) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
      className
    )}>
      {services.map((service, index) => (
        <Card 
          key={index}
          className="group border-0 bg-white shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden"
        >
          {/* Icon */}
          <div className="h-20 flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-colors duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              {service.icon}
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="font-accent text-xl uppercase tracking-wide text-center text-primary-dark mb-2">
              {service.title}
            </CardTitle>
            <div className="w-12 h-px bg-primary mx-auto" />
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="text-secondary-600 leading-relaxed">
              {service.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ==================== 4. TESTIMONIAL CARD ====================
export function TestimonialCard({ 
  quote, 
  author, 
  role, 
  avatar,
  rating = 5,
  className 
}) {
  return (
    <Card className={cn(
      "border-0 bg-gradient-to-br from-white to-primary-50/30 shadow-lg p-8",
      "relative overflow-hidden",
      className
    )}>
      {/* Quote Icon */}
      <div className="absolute top-6 left-6 text-6xl text-primary/10 font-heading">
        "
      </div>
      
      <CardContent className="relative z-10 pt-8">
        {/* Stars */}
        <div className="flex gap-1 mb-4 justify-center">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i}
              className={cn(
                "w-5 h-5",
                i < rating ? "fill-primary" : "fill-gray-300"
              )}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
        </div>
        
        {/* Quote */}
        <blockquote className="text-lg font-body text-primary-dark leading-relaxed text-center mb-6 italic">
          {quote}
        </blockquote>
        
        {/* Divider */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
        
        {/* Author */}
        <div className="flex items-center justify-center gap-4">
          {avatar && (
            <img 
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
          )}
          <div className="text-center">
            <p className="font-accent font-semibold text-primary-dark">
              {author}
            </p>
            <p className="text-sm text-secondary-600 uppercase tracking-wide">
              {role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 5. IMAGE GALLERY AVEC REVEAL ====================
export function ImageGallery({ images, columns = 3, className }) {
  return (
    <div className={cn(
      `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`,
      className
    )}>
      {images.map((image, index) => (
        <div 
          key={index}
          className="group relative h-80 overflow-hidden rounded-lg cursor-pointer"
        >
          {/* Image */}
          <img 
            src={image.src}
            alt={image.alt || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Overlay animé */}
          <div className="image-overlay absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          
          {/* Caption */}
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-heading text-xl mb-2">
                {image.caption}
              </h3>
              {image.description && (
                <p className="text-sm text-white/90">
                  {image.description}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== 6. STATS SECTION ====================
export function StatsSection({ stats, className }) {
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-4 gap-8 py-16",
      className
    )}>
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="text-center group"
        >
          <div className="mb-4">
            {stat.icon && (
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                {stat.icon}
              </div>
            )}
          </div>
          <div 
            className="counter text-5xl font-heading font-bold text-primary mb-2"
            data-target={stat.value}
          >
            0
          </div>
          <div className="text-sm font-accent uppercase tracking-wider text-secondary-600">
            {stat.label}
          </div>
          {stat.description && (
            <p className="text-xs text-secondary-500 mt-2">
              {stat.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== 7. CALL TO ACTION ====================
export function CTASection({ 
  title, 
  description, 
  primaryButton, 
  secondaryButton,
  backgroundImage,
  className 
}) {
  return (
    <section className={cn(
      "relative py-24 overflow-hidden",
      className
    )}>
      {/* Background */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <img 
              src={backgroundImage}
              alt="CTA Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 z-0" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 container-luxury text-center">
        <h2 className="heading-2 text-white mb-6">
          {title}
        </h2>
        
        <div className="w-20 h-px bg-primary mx-auto mb-8" />
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButton}
          {secondaryButton}
        </div>
      </div>
    </section>
  );
}

// ==================== 8. NAVIGATION HEADER ====================
export function LuxuryHeader({ logo, menuItems, ctaButton, className }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg py-4" 
        : "bg-transparent py-6",
      className
    )}>
      <div className="container-luxury flex items-center justify-between">
        {/* Logo */}
        <div className="font-heading text-2xl font-bold">
          <span className={cn(
            "transition-colors duration-300",
            isScrolled ? "text-primary-dark" : "text-white"
          )}>
            {logo}
          </span>
        </div>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={cn(
                "font-accent text-sm uppercase tracking-wide transition-colors duration-300",
                "hover:text-primary relative group",
                isScrolled ? "text-primary-dark" : "text-white"
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          
          {ctaButton}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden bg-white shadow-xl">
          <nav className="container-luxury py-6 flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="mobile-menu-item font-accent text-primary-dark uppercase tracking-wide py-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// Export all components
export default {
  RoomCard,
  HeroSection,
  ServicesGrid,
  TestimonialCard,
  ImageGallery,
  StatsSection,
  CTASection,
  LuxuryHeader
};
