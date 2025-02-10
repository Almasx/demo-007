import { Markdown } from "~/components/markdown";
import { ChatNavigationPanel } from "~/components/chat-navigation";
import { generateHeadersFromMessages } from "~/utils/generate-headers";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const mockMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hello there! I'm ChatGPT, a large language model capable of generating rich text responses. How can I assist you today?\n\nFeel free to ask me anything!",
  },
  {
    role: "user",
    content: "Hi ChatGPT, can you explain how AI works in simple terms?",
  },
  {
    role: "assistant",
    content: `Sure! Here's a long text about the history of human civilization:

---

Human civilization is a vast and complex story spanning thousands of years, beginning with early human societies and progressing through technological, cultural, and political advancements. The journey of humankind from hunter-gatherer groups to the modern, interconnected world is marked by significant milestones, each shaping the way people live, interact, and govern themselves.

### **Early Human Societies and the Dawn of Agriculture**
The earliest humans were nomadic hunter-gatherers, relying on hunting animals and gathering wild plants for sustenance. These groups were small, mobile, and dependent on nature's resources, moving frequently in search of food and favorable climates. However, around 10,000 BCE, a major shift occurred with the advent of agriculture. This Neolithic Revolution marked the beginning of settled communities as people began domesticating plants and animals.

Agriculture allowed for food surpluses, leading to population growth and the establishment of permanent settlements. The first known agricultural societies emerged in the Fertile Crescent, an area in the Middle East that includes parts of modern-day Iraq, Syria, and Turkey. With stable food sources, societies could support larger populations, leading to the rise of villages and eventually cities.

### **The Rise of Ancient Civilizations**
With the establishment of agriculture came the birth of the first civilizations. Some of the earliest known civilizations developed along river valleys, which provided fertile land for crops and easy access to water. Among these were:

- **Mesopotamia (Sumerians, Babylonians, Assyrians)** – Often called the "Cradle of Civilization," Mesopotamia developed early forms of writing (cuneiform), the first known legal codes (Hammurabi's Code), and advanced city-states like Ur and Babylon.
- **Ancient Egypt** – Flourishing along the Nile River, Egyptian civilization is famous for its pyramids, pharaohs, hieroglyphic writing, and complex religious beliefs centered around the afterlife.
- **Indus Valley Civilization (Harappa and Mohenjo-Daro)** – Located in present-day Pakistan and India, this civilization boasted advanced urban planning, drainage systems, and trade networks.
- **Ancient China (Shang and Zhou Dynasties)** – Early Chinese civilization contributed innovations such as bronze casting, silk production, and the development of writing characters.
- **Mesoamerican Civilizations (Olmec, Maya, Aztec)** – In the Americas, societies like the Maya developed sophisticated calendars, writing systems, and massive architectural structures.

Each of these early civilizations laid the foundations for governance, trade, science, and culture, shaping the future of human progress.

### **The Classical Age and the Expansion of Empires**
As civilizations evolved, some grew into vast empires, expanding their territories through conquest, diplomacy, and trade. The classical age (roughly 500 BCE–500 CE) saw the rise of influential empires that left a lasting impact on history.

- **The Persian Empire** – One of the largest empires of its time, the Persians built an extensive network of roads, implemented standardized currency, and promoted religious tolerance.
- **Ancient Greece** – Known for its city-states like Athens and Sparta, Greece made enormous contributions to philosophy, democracy, literature, and science. Thinkers such as Socrates, Plato, and Aristotle laid the foundation for Western thought.
- **The Roman Empire** – Originating from the Italian peninsula, Rome expanded to dominate Europe, North Africa, and parts of Asia. Roman engineering, law, and governance influenced countless societies.
- **The Maurya and Gupta Empires (India)** – Indian civilization flourished with advancements in mathematics, astronomy, literature, and medicine. The concept of zero and early forms of surgery were pioneered here.
- **Han Dynasty China** – This period saw the expansion of the Silk Road, civil service exams, and Confucian philosophy, shaping China for centuries to come.

The classical age set the stage for global interactions, technological advancements, and the blending of cultures.

### **The Medieval Period and the Rise of New Powers**
Following the fall of the Western Roman Empire in 476 CE, the medieval period, or Middle Ages, began. This era (roughly 500–1500 CE) was marked by feudalism, the growth of powerful religious institutions, and the emergence of new empires.

- **The Byzantine Empire** – The continuation of the Eastern Roman Empire, Byzantium preserved Greek and Roman knowledge while influencing Orthodox Christianity and art.
- **The Islamic Golden Age** – From the 8th to the 14th centuries, the Islamic world saw advancements in medicine, mathematics (algebra), astronomy, and literature.
- **Medieval Europe** – Feudalism structured society, with lords, vassals, and serfs governing the land. The Catholic Church played a dominant role in European politics and daily life.
- **The Mongol Empire** – Under Genghis Khan, the Mongols created the largest contiguous land empire in history, facilitating trade and cultural exchange along the Silk Road.
- **African Kingdoms (Mali, Songhai, Great Zimbabwe)** – Africa saw the rise of powerful states, with Mali's Mansa Musa famously known for his wealth and contributions to Islam.

This period also saw significant events like the Crusades, the Black Death, and the rise of trade networks linking Europe, Asia, and Africa.

### **The Renaissance, Exploration, and Scientific Revolution**
Around the 14th to 17th centuries, Europe experienced the Renaissance, a cultural rebirth inspired by classical learning. It was a time of artistic achievements (Leonardo da Vinci, Michelangelo), scientific discoveries (Galileo, Copernicus), and humanist philosophy.

Simultaneously, the Age of Exploration saw European nations like Spain and Portugal venture into the Americas, Africa, and Asia, leading to global trade, colonialism, and cultural exchanges. The Scientific Revolution further propelled human knowledge, with figures like Newton and Kepler making groundbreaking discoveries.

### **The Modern Era: Revolutions, Industrialization, and Globalization**
The modern period (1700s–present) brought dramatic changes:

- **The Enlightenment** – Ideas of liberty, democracy, and human rights gained prominence, inspiring revolutions like the American (1776) and French (1789) Revolutions.
- **The Industrial Revolution** – Starting in Britain, mechanization transformed economies, leading to urbanization, technological progress, and new social challenges.
- **Imperialism and World Wars** – European powers expanded their influence, leading to tensions that resulted in World War I (1914–1918) and World War II (1939–1945).
- **The Cold War and the Digital Age** – The 20th century was marked by ideological conflicts between capitalism (USA) and communism (USSR), while advancements in computers, space travel, and communication revolutionized society.

### **The Future of Human Civilization**
Today, civilization faces new challenges and opportunities: climate change, artificial intelligence, space exploration, and globalization. As humanity continues to innovate, the future holds the potential for unprecedented discoveries and transformations.

The story of human civilization is far from over—each generation contributes to its ongoing development, shaping the world for future societies.`,
  },
  {
    role: "user",
    content:
      "That's interesting. Can you tell me more about how neural networks function?",
  },
  {
    role: "assistant",
    content:
      "Of course! Neural networks consist of layers of interconnected nodes: \n\n1. **Input Layer:** Receives raw data.\n2. **Hidden Layers:** Process the data through weighted connections and activation functions.\n3. **Output Layer:** Produces the final result.\n\nThe network uses **backpropagation** to adjust weights and minimize error during training.",
  },
  {
    role: "user",
    content:
      "Can you provide examples of real-world applications of these technologies?",
  },
  {
    role: "assistant",
    content:
      "Sure! Here are a few real-world applications:\n\n- **Image Recognition:** Used in self-driving cars and facial recognition systems.\n- **Natural Language Processing (NLP):** Powers chatbots, translation services, and sentiment analysis.\n- **Recommender Systems:** Helps services like Netflix or Amazon suggest content based on user behavior.",
  },
  {
    role: "user",
    content:
      "Can you break down the steps involved in training a neural network?",
  },
  {
    role: "assistant",
    content:
      "Absolutely. Here's a step-by-step breakdown:\n\n### Training Steps:\n\n1. **Data Collection:** Gather and preprocess data.\n2. **Model Initialization:** Set up the neural network with random weights.\n3. **Forward Propagation:** Pass data through the network to generate predictions.\n4. **Loss Calculation:** Compute the error between predictions and actual outcomes.\n5. **Backward Propagation:** Adjust weights based on gradients from the loss function.\n6. **Iteration:** Repeat until the model reaches an acceptable level of accuracy.",
  },
  {
    role: "user",
    content:
      "Nice! Could you also adjust your explanation to include markdown-like formatting for clarity?",
  },
  {
    role: "assistant",
    content:
      "Certainly! Here's the same explanation with markdown formatting:\n\n```markdown\n# Steps to Train a Neural Network\n\n1. **Data Collection** - Gather and preprocess data.\n2. **Model Initialization** - Initialize weights randomly.\n3. **Forward Propagation** - Compute predictions.\n4. **Loss Calculation** - Measure error using a loss function.\n5. **Backward Propagation** - Update weights based on the gradient.\n6. **Iteration** - Repeat until convergence.\n```\n\nThis formatting helps to clearly structure the steps!",
  },
  {
    role: "user",
    content:
      "What are the differences between supervised and unsupervised learning?",
  },
  {
    role: "assistant",
    content:
      "Great question! Here are the key differences:\n\n- **Supervised Learning:**\n  - Uses labeled data.\n  - The model learns by comparing its output with known answers.\n  - Examples: Classification and regression tasks.\n\n- **Unsupervised Learning:**\n  - Works with unlabeled data.\n  - The model identifies hidden patterns or structures in the data.\n  - Examples: Clustering and dimensionality reduction.",
  },
  {
    role: "user",
    content: "That's very helpful. Can you add more details on each type?",
  },
  {
    role: "assistant",
    content:
      "Certainly!\n\n**Supervised Learning:**\n- Often applied when historical data comes with clear outputs.\n- Common algorithms: Decision Trees, Support Vector Machines (SVM), Neural Networks.\n- Evaluation metrics like accuracy, precision, and recall are used.\n\n**Unsupervised Learning:**\n- Explores data without predefined labels.\n- Common techniques: K-Means Clustering, Principal Component Analysis (PCA), Autoencoders.\n- Helps in discovering hidden patterns and segmenting data into meaningful groups.",
  },
  {
    role: "user",
    content:
      "Great, now summarize the whole conversation in a brief header list for quick navigation.",
  },
  {
    role: "assistant",
    content:
      "Summary of Conversation:\n\n- **Introduction:** ChatGPT introduces itself and offers help.\n- **AI Overview:** Provides an explanation of AI, machine learning, and deep learning.\n- **Neural Network Details:** Explains the structure of neural networks and backpropagation.\n- **Real-World Applications:** Lists practical applications such as image recognition and NLP.\n- **Training Process:** Breaks down the steps involved in training a neural network.\n- **Markdown Formatting:** Demonstrates how to use markdown formatting for clarity.\n- **Learning Types:** Compares and contrasts supervised and unsupervised learning with details.\n- **Navigation Summary:** Offers a concise header list for navigating the conversation topics.",
  },
];

export default function Home() {
  const headers = generateHeadersFromMessages(mockMessages);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="sticky top-0 h-screen">
        <ChatNavigationPanel headers={headers} />
      </div>
      <main className="flex-1 overflow-y-auto w-[375px]">
        <div className="flex flex-col px-[13px] py-4 space-y-[37px]">
          {mockMessages.map((message, index) => (
            <article
              key={index}
              id={`message-${index}`}
              className={
                message.role === "assistant"
                  ? "flex flex-col space-y-2"
                  : "flex justify-end"
              }
            >
              {message.role === "assistant" ? (
                <Markdown className="prose max-w-[600px] -space-y-3 text-[#0D0D0D]">
                  {message.content}
                </Markdown>
              ) : (
                <div className="bg-[#E8E8E8]/50 rounded-[24px] px-5 py-[10px] text-[#0D0D0D] leading-6 max-w-[70%]">
                  {message.content}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
