-- Seed sample pets data
INSERT INTO public.pets (name, species, breed, age_months, gender, size, image_url, color, description, is_vaccinated, is_neutered, is_house_trained, good_with_kids, good_with_pets, status)
VALUES 
  ('Buddy', 'dog', 'Golden Retriever', 24, 'male', 'large', 
   'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=800&fit=crop',
   'Golden',
   'Meet Buddy, a friendly and playful Golden Retriever who loves everyone he meets! Buddy enjoys long walks in the park, playing fetch, and cuddling on the couch. He is great with kids and other dogs, making him the perfect family companion.',
   true, true, true, true, true, 'available'),
   
  ('Luna', 'cat', 'British Shorthair', 12, 'female', 'medium',
   'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=800&fit=crop',
   'Gray',
   'Luna is a beautiful British Shorthair with mesmerizing eyes. She is calm, affectionate, and loves to be pampered. Luna enjoys lounging in sunny spots and will purr contentedly when you pet her.',
   true, true, true, true, true, 'available'),
   
  ('Max', 'dog', 'German Shepherd', 36, 'male', 'large',
   'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=800&fit=crop',
   'Black and Tan',
   'Max is a loyal and intelligent German Shepherd looking for his forever home. He is highly trainable and loves to learn new tricks. Max is protective of his family while being gentle and affectionate with those he trusts.',
   true, true, true, true, true, 'available'),
   
  ('Milo', 'cat', 'Tabby', 6, 'male', 'small',
   'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=800&fit=crop',
   'Orange Tabby',
   'Milo is an energetic and curious tabby kitten who is always ready for adventure. He loves to play with toys, chase laser pointers, and explore every corner of the house. Milo would be perfect for an active household.',
   true, false, true, true, true, 'available'),
   
  ('Bella', 'dog', 'Labrador Mix', 48, 'female', 'medium',
   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop',
   'Chocolate',
   'Bella is a sweet and gentle Labrador mix who loves nothing more than being by your side. She enjoys hiking, swimming, and playing in the backyard. Bella is patient and wonderful with children of all ages.',
   true, true, true, true, true, 'available'),
   
  ('Oliver', 'cat', 'Maine Coon', 24, 'male', 'large',
   'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800&h=800&fit=crop',
   'Brown Tabby',
   'Oliver is a majestic Maine Coon with a gentle giant personality. Despite his large size, he is incredibly gentle and loves to cuddle. Oliver enjoys playing with feather toys and watching birds from the window.',
   true, true, true, true, true, 'available'),
   
  ('Daisy', 'dog', 'Beagle', 12, 'female', 'medium',
   'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=800&fit=crop',
   'Tricolor',
   'Daisy is a curious and loving Beagle who follows her nose everywhere. She loves to explore, play, and snuggle. Daisy would thrive in a home with a fenced yard where she can safely investigate interesting scents.',
   true, true, true, true, true, 'available'),
   
  ('Charlie', 'cat', 'Persian', 36, 'male', 'medium',
   'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop',
   'White',
   'Charlie is an elegant Persian cat who enjoys the finer things in life. He loves being brushed, napping on soft blankets, and receiving gentle head scratches. Charlie is perfect for a calm, quiet household.',
   true, true, true, true, true, 'available'),
   
  ('Rocky', 'dog', 'Bulldog', 60, 'male', 'medium',
   'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=800&fit=crop',
   'Brindle',
   'Rocky is a lovable Bulldog with a heart of gold. He may look tough, but he is a total softie who loves belly rubs and couch cuddles. Rocky is laid-back and perfect for apartment living.',
   true, true, true, true, true, 'available'),
   
  ('Coco', 'rabbit', 'Holland Lop', 12, 'female', 'small',
   'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=800&fit=crop',
   'Brown and White',
   'Coco is an adorable Holland Lop rabbit with the cutest floppy ears. She is friendly, curious, and loves to hop around exploring. Coco enjoys being petted and would make a wonderful first pet.',
   true, true, true, true, false, 'available'),
   
  ('Cooper', 'dog', 'Australian Shepherd', 24, 'male', 'medium',
   'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&h=800&fit=crop',
   'Blue Merle',
   'Cooper is a high-energy Australian Shepherd who lives for adventure. He excels at agility, loves to play frisbee, and is incredibly smart. Cooper needs an active family who can keep up with his energy.',
   true, true, true, true, true, 'available'),
   
  ('Whiskers', 'cat', 'Siamese', 48, 'female', 'medium',
   'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&h=800&fit=crop',
   'Seal Point',
   'Whiskers is a talkative Siamese who loves to have conversations with her humans. She is social, playful, and incredibly affectionate. Whiskers would love a home where someone is around often to chat with her.',
   true, true, true, true, true, 'available')
ON CONFLICT DO NOTHING;
