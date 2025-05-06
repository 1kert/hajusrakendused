export interface StoreItem {
    id: number
    image: string
    name: string
    description: string
    price: number
}

export default class StoreRepository {
    private static storeItems: StoreItem[] = [
        {
            id: 0,
            image: "https://media.istockphoto.com/id/494494556/photo/close-up-of-a-brick.jpg?s=612x612&w=0&k=20&c=yHrm8KudU65KwNAkNUhG9iVGHaIWYqhDdIs7rFmA0xE=",
            name: "USB-Powered Brick",
            description: "Minimalist. Elegant. The USB-Powered Brick is the ultimate statement piece for your desk or gaming setup. Plug it in and bask in the cool LED glow—it doesn’t need to do anything else. It’s not about function. It’s about presence. It’s a brick, but make it fashion.",
            price: 59.99
        },
        {
            id: 1,
            image: "https://img.freepik.com/free-photo/smiley-old-man-with-glasses_23-2148740051.jpg?semt=ais_hybrid&w=740",
            name: "Harold",
            description: "Harold is a gardening savant. He doesn't just tend to plants—he communicates with them. Whether it's planting, pruning, or giving sage life advice to your succulents, Harold does it all with quiet intensity and unmatched skill. No backstory, no small talk—just pure horticultural excellence.",
            price: 170.20
        },
        {
            id: 2,
            image: "https://www.pockettactics.com/wp-content/sites/pockettactics/2022/11/games-like-gta-3-550x309.jpg",
            name: "GTA VI",
            description: "Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet.",
            price: 2499.99
        },
        {
            id: 3,
            image: "https://allthatsinteresting.com/wordpress/wp-content/uploads/2022/12/demon-core.jpeg",
            name: "Spicy metal ball",
            description: "For the collector who already owns everything else. This sphere of spicy plutonium adds instant drama to any room. A centerpiece that screams power, danger, and questionable legality. Batteries not included.",
            price: 12.99
        },
        {
            id: 4,
            image: "https://images.squarespace-cdn.com/content/v1/50130f1ae4b006ef41174e6b/1430322669039-UTRW05I21DWH9TFJQW4A/e5a7_canned_unicorn_meat.jpg",
            name: "Unicorn meat",
            description: "Finally, a premium protein that brings joy, sparkle, and just a hint of forbidden magic. Our unicorn meat is rich in whimsy, ethically-sourced from parallel universes, and sealed in rainbow-infused cans. Perfect for parties, rituals, or confusing TSA agents. Every bite is a fantasy.",
            price: 49.99
        },
        {
            id: 5,
            image: "https://ae-pic-a1.aliexpress-media.com/kf/Sa94ccb8dd12e49e89f5380adab475660J.jpg_480x480q75.jpg_.webp",
            name: "Fashionable school bag",
            description: 'A bold, standout design. This bag combines durable construction with cutting-edge style, making it perfect for school and travel. Comfortable straps, spacious interior, and a striking aesthetic that says, “I have taste, and I carry it on my back."',
            price: 24.99
        },
        {
            id: 6,
            image: "https://img.freepik.com/premium-psd/closeup-hand-gripping-rock-climbing-isolated-white-background-png-transparent_1187-467791.jpg?semt=ais_hybrid",
            name: "Cool Rock That I Found",
            description: "Not just a rock—a moment. Hand-selected from a mysterious location, this rock radiates personality and unmatched geological swagger. No two are the same. Put it on your shelf, use it as a worry stone, or name it something majestic. Your desk deserves this.",
            price: 9.99
        },
        {
            id: 7,
            image: "https://media.gettyimages.com/id/510828281/photo/half-eaten-sandwich-on-plate.jpg?s=612x612&w=0&k=20&c=JhdFnYzpSTHO2oGNUrjyGTS4QVYwpwaNeP3KTGv0iFQ=",
            name: "Half-Eaten Sandwich",
            description: "I made this sandwich, took a bite, and realized I wasn’t actually that hungry. Rather than waste it, I’m passing it on. It’s still got good structural integrity and some solid flavor layers. A sustainable, second-hand snack experience—because food shouldn’t go to waste, and stories are better when shared.",
            price: 19.99
        },
        {
            id: 8,
            image: "https://img.pastemagazine.com/wp-content/avuploads/2022/03/15014636/54be97e2c07bec73c897e291835e8bb4.jpg",
            name: "Gaming PC",
            description: "This high-performance gaming PC is built to handle the latest titles with ease. Fast processor, solid GPU, sleek case—everything you need to dominate your favorite games. Whether you're streaming, editing, or just crushing leaderboards, this rig delivers smooth, responsive power right out of the box.",
            price: 99.99
        }
    ]
    
    static async getStoreItems(): Promise<StoreItem[]> {
        return this.storeItems
    }
    
    static async createStoreItem() {
        // todo: when admin interface is implemented
    }
    
    static async deleteStoreItem() {
        // todo: when admin interface is implemented
    }
    
    static async updateStoreItem() {
        // todo: when admin interface is implemented
    }
}