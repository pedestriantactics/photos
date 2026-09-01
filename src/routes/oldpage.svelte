<!-- src/routes/blog/+page.svelte -->
<script>
	let { data } = $props();
</script>

<h1>Blog</h1>

<ul>
	{#each data.posts as post}
		<li>
			<h2>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h2>
			Published {post.meta.shootDate}
		</li>
	{/each}
</ul>
