import express from "express";
import bodyParser from "body-parser";
import sanitizeHtml from "sanitize-html";
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { blogs: blogs });
});

app.get("/create", (req, res) => {
    res.render("partials/new-blog.ejs");
});

app.post("/blogs/create", (req, res) => {
    const newBlog = {
        title: req.body.title,
        content: req.body.content,
        _id: String(blogs.length + 1)
    };
    blogs.push(newBlog);
    res.redirect("/");
});

app.get("/manage", (req, res) => {
    res.render("partials/manage-blog.ejs", { blogs: blogs });
});

app.delete("/blogs/:id/delete", (req, res) => {
    const blogIdToDelete = req.params.id;
    const index = blogs.findIndex(blog => blog._id === blogIdToDelete);

    if (index === -1) {
        return res.status(404).json({ error: "Blog not found" });
    }

    blogs.splice(index, 1);
    res.json({ success: true });
});

app.get("/blogs/:id/edit", (req, res) => {
    const blogIdToEdit = req.params.id;
    const index = blogs.findIndex(blog => blog._id === blogIdToEdit);

    if (index === -1) {
        return res.status(404).send("Blog not found");
    }
    res.render("partials/edit-blog.ejs", { blog: blogs[index] });
});

app.post("/blog/:id/update", (req, res) => {
    const blogIdToUpdate = req.params.id;
    const index = blogs.findIndex(blog => blog._id === blogIdToUpdate);

    if (index === -1) {
        return res.status(404).send("Blog not found");
    } else {
        blogs[index].title = req.body.title;
        blogs[index].content = req.body.content;
        res.redirect("/");
    }
});


// view blog
app.get("/blogs/:id", (req, res) => {
    const blog = blogs.find(b => b._id === req.params.id);

    const cleanHtml = sanitizeHtml(blog.content, {
        allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
        allowedAttributes: {
            'a': ['href']
        }
    });

    if (blog) {
        res.render("partials/view-blog.ejs", { blog: blog });
    } else {
        res.status(404).send("Blog not found");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

let blogs = [
    {
        title: "First Blog",
        content: "This is the content of the first blog.",
        _id: "1"
    },
    {
        title: "Second Blog",
        content: "This is the content of the second blog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        _id: "2"
    },
    {
        title: "Third Blog",
        content: "This is the content of the third blog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        _id: "3"
    },
    {
        title: "Fourth Blog",
        content: "This is the content of the fourth blog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        _id: "4"
    }
];
