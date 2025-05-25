"use client";

import Image from 'next/image';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: '/team-1.jpg',
      bio: 'With over 15 years of experience in fashion retail.',
    },
    {
      name: 'Jane Smith',
      role: 'Creative Director',
      image: '/team-2.jpg',
      bio: 'Former designer at top fashion houses.',
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Operations',
      image: '/team-3.jpg',
      bio: 'Expert in supply chain and logistics.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We are passionate about bringing you the finest fashion collection,
          curated with care and attention to detail.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src="/about-image.jpg"
            alt="Our Mission"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-gray-600">
            Our mission is to provide high-quality fashion items that make our
            customers feel confident and beautiful. We believe in sustainable
            practices and ethical manufacturing processes.
          </p>
          <p className="text-gray-600">
            Every piece in our collection is carefully selected to ensure it meets
            our high standards of quality, style, and comfort.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-background/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Quality</h3>
            <p className="text-gray-600">
              We never compromise on quality. Every item is crafted with the finest
              materials and attention to detail.
            </p>
          </div>
          <div className="text-center p-6 bg-background/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Sustainability</h3>
            <p className="text-gray-600">
              We are committed to sustainable practices and reducing our
              environmental impact.
            </p>
          </div>
          <div className="text-center p-6 bg-background/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Customer First</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We strive to
              provide exceptional service and products.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-primary mb-2">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 